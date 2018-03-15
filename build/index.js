const fs = require('fs-extra');
const path = require('path');
const watch = require('watch');

const util = require('./util');
const transpiler = require('./transpiler');
const MyServer = require('./server');
const logger = require('./logger');

//================================== UTIL ====================================//

const inspect = util.inspect;
const filterExtensions = util.filterExtensions;
const createDirTree = util.createDirTree;
const getFileFromFilename = util.getFileFromFilename;

//================================== PATHS ===================================//

let clientPublicDir;
let cssDir;
let javaScriptDir;

const sassDir = 'styles';
const viewsDir = 'views';
const contentsDir = 'contents';
const contentsOutputDir = 'views/contents';

const clientSrcDir = 'src/client';
const clientDistDir = 'dist/client';

const serverSrcDir = 'src/server';
const serverDistDir = 'dist/server';
const serverIndexPath = 'dist/server/index.js';

let config;
let server;

//======================== FOLDER STRUCTURE HOLDERS ==========================//

let contentFiles;
let clientFiles;
let serverFiles;
let publicFiles;

function updateContentsDirTree() {
  contentFiles = createDirTree(contentsDir, {
    filter: filterExtensions([ 'md' ])
  });
}

function updateClientDirTree() {
  clientFiles = createDirTree(clientSrcDir, {
    filter: filterExtensions([ 'js', 'json' ])
  });
}

function updateServerDirTree() {
  serverFiles = createDirTree(serverSrcDir, {
    filter: filterExtensions([ 'js', 'json' ])
  });
}

function updatePublicDirTree() {
  publicFiles = createDirTree(clientPublicDir, {
    filter: filterExtensions([ 'html' ])
  });
}

// let configName = 'default';

// if (process.argv.length > 3) {
//   configName = process.argv[3];
// }

const configName = process.argv[3] || 'default';

updateServerDirTree();
const file = getFileFromFilename(`src/server/config/${configName}.js`, serverFiles);
// console.log(inspect(file));
transpiler.transpileFile(file, serverSrcDir, serverDistDir)
.then(function() {
  config = require(path.join('../dist/server/config', configName)).default;
  clientPublicDir = config.publicDir;
  cssDir = path.join(clientPublicDir, 'css');
  javaScriptDir = path.join(clientPublicDir, 'js');

  server = new MyServer(serverIndexPath, config);

  //============================ SCRIPT SELECTOR =============================//

  if (process.argv.length > 2) {
    if (process.argv[2] === 'watch') {
      build().then(start);
      watchSource();
    } else if (process.argv[2] === 'start') {
      build().then(start);
    } else if (process.argv[2] === 'render') {
      build().then(renderHtml);
    }
  }
});


//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//================================== BUILD ===================================//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function build() {

  updateContentsDirTree()
  updateClientDirTree();
  updateServerDirTree();

  //==========================================================================//
  //==================== TRANSPILE / BUNDLE EVERYTHING =======================//
  //========================== AND START SERVER ==============================//
  //==========================================================================//

  // clean old transpiled / bundled files
  fs.removeSync(cssDir);
  fs.removeSync(javaScriptDir);
  fs.removeSync(clientDistDir);
  fs.removeSync(serverDistDir);

  logger.startTwirling();

  return new Promise(function(resolve, reject) {
    Promise.all([
      // regenerate them from actual source code
      transpiler.renderStyle(sassDir, cssDir),
      transpiler.renderEjsFilesFromMarkdown(contentFiles, contentsDir, contentsOutputDir, config),
      transpiler.transpileFileAndChildren(clientFiles, clientSrcDir, clientDistDir),
      transpiler.bundleFileAndChildren(clientFiles, clientSrcDir, clientDistDir, javaScriptDir),
      transpiler.transpileFileAndChildren(serverFiles, serverSrcDir, serverDistDir),
    ]).then(function() {
      logger.stopTwirling();
      logger.notifyDone();
      resolve();
    });
  });
}

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//================================== START ===================================//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function start() {
  // todo: delete static html files from public dir
  server.start();
}

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//================================= RENDER ===================================//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function renderHtml() {
  updateContentsDirTree();
  updatePublicDirTree();
  const routes = require('../dist/server/routes').default;
  logger.startTwirling();

  // transpiler.renderEjsFilesFromMarkdown(contentFiles, contentsDir, contentsOutputDir, config);
  transpiler.removeHtmlFiles(publicFiles);
  transpiler.renderHtmlFiles(routes, clientPublicDir, config)
  .then(function() {
    logger.stopTwirling();
    logger.notifyDone();
  });
}

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//================================== WATCH ===================================//
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function watchSource() {

  //============================ WATCH STYLES ================================//

  const onStyleSrcChange = function(f) {
    logger.startTwirling();

    transpiler.renderStyle(sassDir, cssDir)
    .then(function() {
      logger.stopTwirling();
      logger.notifyDone();
    });
  };

  watch.createMonitor(sassDir, {
    filter: filterExtensions([ 'scss' ])
  }, function(monitor) {
    monitor.on('created', onStyleSrcChange);
    monitor.on('changed', onStyleSrcChange);
    monitor.on('removed', function(f) { /* do nothing */ });
  });

  //=========================== WATCH CONTENTS ===============================//

  const onContentsChange = function(f) {
    updateContentsDirTree();
    const file = getFileFromFilename(f, contentFiles);
    logger.startTwirling();

    transpiler.renderEjsFilesFromMarkdown(file, contentsDir, contentsOutputDir, config)
    .then(function() {
      logger.stopTwirling();
      logger.notifyDone();
    });
  };

  watch.createMonitor(contentsDir, {
    filter: filterExtensions([ 'md' ])
  }, function(monitor) {
    monitor.on('created', onContentsChange);
    monitor.on('changed', onContentsChange);
    monitor.on('removed', function(f) {
      fs.removeSync(f.replace(contentsDir, contentsOutputDir));
    });
  });

  //=========================== WATCH CLIENT SRC =============================//

  const onClientSrcChange = function(f) {
    updateClientDirTree();
    const file = getFileFromFilename(f, clientFiles);
    logger.startTwirling();

    transpiler.transpileFile(file, clientSrcDir, clientDistDir)
    .then(function() {
      transpiler.bundleFileAndParents(file, clientSrcDir, clientDistDir, javaScriptDir);
    })
    .then(function() {
      logger.stopTwirling();
      logger.notifyDone();
    });
  };

  watch.createMonitor(clientSrcDir, {
    filter: filterExtensions([ 'js', 'json' ])
  }, function(monitor) {
    monitor.on('created', onClientSrcChange);
    monitor.on('changed', onClientSrcChange);
    monitor.on('removed', function(f) {
      fs.removeSync(f.replace(clientSrcDir, clientDistDir));
      fs.removeSync(f.replace(clientSrcDir, javaScriptDir));
    });
  });

  //=========================== WATCH SERVER SRC =============================//

  const onServerSrcChange = function(f) {
    updateServerDirTree();
    const file = getFileFromFilename(f, serverFiles);
    logger.startTwirling();

    transpiler.transpileFile(file, serverSrcDir, serverDistDir)
    .then(function() {
      logger.stopTwirling();
      logger.notifyDone();
      server.restart();
    });
  };

  watch.createMonitor(serverSrcDir, {
    filter: filterExtensions([ 'js', 'json' ])
  }, function(monitor) {
    monitor.on('created', onServerSrcChange);
    monitor.on('changed', onServerSrcChange);
    monitor.on('removed', function(f) {
      fs.removeSync(f.replace(clientSrcDir, clientDistDir));
      fs.removeSync(f.replace(clientSrcDir, javaScriptDir));
    });
  });
}
