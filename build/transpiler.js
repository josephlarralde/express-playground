const marked = require('marked');
const mustache = require('mustache');
const sass = require('node-sass');
const babel = require('babel-core');
const browserify = require('browserify');
const uglify = require('uglify-js');
const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');

const logger = require('./logger');
const inspect = require('./util').inspect;

const cwd = process.cwd();

//=============================== NODE_SASS ==================================//

// this one is really basic :
// it just renders a main.scss file to a main.css file
// using @import directive and partials (scss files starting with a '_');

function renderStyle(inputDir, outputDir) {
  return new Promise(function(resolve, reject) {
    const mainFilename = `${inputDir}/main.scss`;
    const outputFilename = `${outputDir}/main.css`;
    const task = `rendering file ${mainFilename} to ${outputFilename}`;
    logger.notifyStartTask(task);

    sass.render({
      file: mainFilename,
      outFile: outputFilename,
      includePaths: [ inputDir ],
    }, function(err, res) {
      if (err !== null) {
        logger.notifyTaskError(task, err);
      } else {
        fs.ensureFileSync(outputFilename);
        fs.writeFileSync(outputFilename, res.css);
      }
      resolve();
    });
  });
}

//============================= EJS TEMPLATES ================================//

//======================== RENDER EJS FROM MARKDOWN ==========================//

function renderEjsFileFromMarkdown(inputFile, inputDir, outputDir, data) {
  return new Promise(function(resolve, reject) {
    if (inputFile.type === 'file') {
      let outputFilepath = inputFile.path.replace(inputDir, outputDir);
      outputFilepath = outputFilepath.replace('.md', '.ejs');
      const task = `converting file ${inputFile.path} to ${outputFilepath}`;
      logger.notifyStartTask(task);

      marked(fs.readFileSync(inputFile.path, 'utf-8'), {
        // some options ?
        sanitize: false,
        smartlists: true,
      }, function(err, res) {
        if (err !== null) {
          logger.notifyTaskError(task, err);
        } else {
          const html = mustache.render(res, data);
          fs.ensureFileSync(outputFilepath);
          fs.writeFileSync(outputFilepath, html);
        }
        resolve();
      });
    } else {
      logger.notifyTaskError(task, 'bad file format');
    }
  });
}

function renderEjsFilesFromMarkdownImpl(inputFiles, inputDir, outputDir, data, promises = []) {
  if (inputFiles.type === 'file') {
    let outputFilepath = inputFiles.path.replace(inputDir, outputDir);
    outputFilepath = outputFilepath.replace('.md', '.ejs');
    const task = `converting file ${inputFiles.path} to ${outputFilepath}`;
    logger.notifyStartTask(task);

    promises.push(new Promise(function(resolve, reject) {
      marked(fs.readFileSync(inputFiles.path, 'utf-8'), function(err, res) {
        if (err !== null) {
          logger.notifyTaskError(task, err);
        } else {
          const html = mustache.render(res, data);
          fs.ensureFileSync(outputFilepath);
          fs.writeFileSync(outputFilepath, html);
        }
        resolve();
      });
    }));
  } else if (inputFiles.type === 'folder' && inputFiles.children) {
    for (let i = 0; i < inputFiles.children.length; i++) {
      renderEjsFilesFromMarkdownImpl(inputFiles.children[i], inputDir, outputDir, data, promises);
    }
  }
}

function renderEjsFilesFromMarkdown(inputFiles, inputDir, outputDir, data) {
  const renderPromises = [];
  renderEjsFilesFromMarkdownImpl(inputFiles, inputDir, outputDir, data, renderPromises);
  return Promise.all(renderPromises);
}

//========================== RENDER HTML FROM EJS ============================//

// see: src/server/routes.js file
// we assume a correct structure for a route : { data: { articles: strArray }}

function loadHtmlContents(route) {
  if (Array.isArray(route.data.articles)) {
    const a = route.data.articles;
    route.data.contents = [];

    for (let i = 0; i < a.length; i++) {
      const filepath = path.join(cwd, 'contents', a[i] + '.html');
      route.data.contents.push(fs.readFileSync(filepath));
    }
  }
};

function transformRouteNames(route, config) {
  if (typeof route === 'object') {
    for (let key in route) {
      if (key === 'route') {
        if (route[key].lastIndexOf('/', 0) === 0 && !route.prependedServerRoot) {
          route[key] = `${config.serverRoot}${route[key]}`
          route.prependedServerRoot = true;
        }
      } else {
        transformRouteNames(route[key], config);
      }
    }
  }
}

function renderHtmlFile(route, outputDir, config) {
  return new Promise(function(resolve, request) {
    const outputFilepath = route.data.title === '404'
                         ? path.join(outputDir, '404.html')
                         : path.join(outputDir, route.route, 'index.html');
    const task = `rendering file ${outputFilepath}`
    logger.notifyStartTask(task);
    transformRouteNames(route, config);
    // loadHtmlContents(route);

    const templatePath = path.join('views', `${route.template}.ejs`);

    ejs.renderFile(templatePath, route, {}, function(err, res) {
      if (err !== null) {
        logger.notifyTaskError(task, err);
      } else {
        fs.ensureFileSync(outputFilepath);
        fs.writeFileSync(outputFilepath, res);
      }
      resolve();
    });
  });
}

function renderHtmlFiles(routes, outputDir, config) {
  const promises = [];

  for (var r in routes) {
    routes[r].config = config;
    promises.push(renderHtmlFile(routes[r], outputDir, config));
  }

  return Promise.all(promises);
}

function removeHtmlFiles(inputFiles) {
  if (inputFiles.type === 'file' /* && path.extname(inputFiles.path) === '.html' */) {
    fs.removeSync(inputFiles.path);
  } else if (inputFiles.type === 'folder' && inputFiles.children) {
    for (let i = 0; i < inputFiles.children.length; i++) {
      removeHtmlFiles(inputFiles.children[i]);
    }
  }
}

//================================= BABEL ====================================//

function transpileFile(inputFile, inputDir, outputDir) {
  return new Promise(function(resolve, reject) {
    const outputFilepath = inputFile.path.replace(inputDir, outputDir);

    if (inputFile.type === 'file') {
      const task = `transpiling file ${inputFile.path} to ${outputFilepath}`
      logger.notifyStartTask(task);

      babel.transformFile(inputFile.path, {}, function(err, res) {
        if (err !== null) {
          logger.notifyTaskError(task, err);
        } else {
          fs.ensureFileSync(outputFilepath);
          fs.writeFileSync(outputFilepath, res.code);
        }
        resolve();
      });
    } else {
      logger.notifyStartTask(`creating directory ${outputFilepath} ...`);
      resolve();
    }
  });
}

// recursive function pushing a promise for each started transpiling file
// its execution is synchronous so we can use the promises array afterwards

function transpileFileAndChildrenImpl(inputFiles, inputDir, outputDir, promises = []) {
  if (inputFiles.type === 'file') {
    const outputFilepath = inputFiles.path.replace(inputDir, outputDir);
    const task = `transpiling file ${inputFiles.path} to ${outputFilepath}`;
    logger.notifyStartTask(task);

    promises.push(new Promise(function(resolve, reject) {
      babel.transformFile(inputFiles.path, {}, function(err, res) {
        if (err !== null) {
          logger.notifyTaskError(task, err);
        } else {
          fs.ensureFileSync(outputFilepath);
          fs.writeFileSync(outputFilepath, res.code);
        }
        resolve();
      });
    }));
  } else if (inputFiles.type === 'folder' && inputFiles.children) {
    for (let i = 0; i < inputFiles.children.length; i++) {
      transpileFileAndChildrenImpl(inputFiles.children[i], inputDir, outputDir, promises);
    }
  }
}

function transpileFileAndChildren(inputFiles, inputDir, outputDir) {
  const transpilePromises = [];
  transpileFileAndChildrenImpl(inputFiles, inputDir, outputDir, transpilePromises);
  return Promise.all(transpilePromises);
}

//============================== BROWSERIFY ==================================//

function bundleFile(file, srcDir, distDir, bundleDir, config) {
  return new Promise(function(resolve, reject) {
    const distFilepath = file.path.replace(srcDir, distDir);
    const bundleFilepath = config.minify
                         ? file.path.replace(srcDir, bundleDir).replace('.js', '.min.js')
                         : file.path.replace(srcDir, bundleDir);
    const task = `bundling file ${distFilepath} to ${bundleFilepath}`;
    logger.notifyStartTask(task);

    const b = browserify();
    b.add(distFilepath);

    b.bundle(function(err, res) {
      if (err !== null) {
        logger.notifyTaskError(task, err);
      } else {
        if (config.minify) {
          res = uglify.minify(res.toString());
          res = res.code;
        }
        fs.ensureFileSync(bundleFilepath);
        fs.writeFileSync(bundleFilepath, res);
      }
      resolve();
    });
  });
}

// recursive function pushing a promise for each started bundling file
// its execution is synchronous so we can use the promises array afterwards

// pass this function a folder

function bundleFileAndChildrenImpl(changedFile, srcDir, distDir, bundleDir, config, promises) {
  if (changedFile.type === 'file' && changedFile.name === 'index.js') {
    promises.push(bundleFile(changedFile, srcDir, distDir, bundleDir, config));
  } else if (changedFile.type === 'folder' && changedFile.children) {
    for (let i = 0; i < changedFile.children.length; i++) {
      bundleFileAndChildrenImpl(changedFile.children[i], srcDir, distDir, bundleDir, config, promises);
    }
  }
}

function bundleFileAndChildren(changedFile, srcDir, distDir, bundleDir, config) {
  const bundlePromises = [];
  bundleFileAndChildrenImpl(changedFile, srcDir, distDir, bundleDir, config, bundlePromises)
  return Promise.all(bundlePromises);
}

// recursive function pushing a promise for each started bundling file
// its execution is synchronous so we can use the promises array afterwards

// HOW IT WORKS :

// get parent folder of changedFile (or keep it if it's already a folder)
// if it contains an index file, transpile it and all other upper level index files
// if not, transpile all index files located in same level folder, and all other
// upper level index files

function bundleFileAndParentsImpl(changedFile, srcDir, distDir, bundleDir, config, promises) {
  let rootDir;

  if (changedFile.type === 'file') {
    rootDir = changedFile.parent;
  } else if (changedFile.type === 'folder') {
    rootDir = changedFile;
  }

  const children = rootDir.children;
  const brothers = rootDir.parent !== null ? rootDir.parent.children : null;

  if (rootDir.containsIndexFile) { // only rebundle this one
    for (i = 0; i < children.length; i++) {
      if (children[i].name === 'index.js') {
        promises.push(bundleFile(children[i], srcDir, distDir, bundleDir, config));
        break;
      }
    }
  } else { // bundling all the index files contained in the same level folders
    if (brothers !== null) {
      for (let i = 0; i < brothers.length; i++) {
        if (brothers[i].type === 'folder' && brothers[i].containsIndexFile) {
          const nephews = brothers[i].children;
          for (let j = 0; j < nephews.length; j++) {
            if (nephews[j].name === 'index.js') {
              promises.push(bundleFile(nephews[j], srcDir, distDir, bundleDir, config));
              break;
            }
          }
        }
      }
    }
  }

  // then propagate to parents
  if (rootDir.parent !== null) {
    bundleFileAndParentsImpl(rootDir.parent, srcDir, distDir, bundleDir, config, promises);
  }
}

function bundleFileAndParents(changedFile, srcDir, distDir, bundleDir, config) {
  const bundlePromises = [];
  bundleFileAndParentsImpl(changedFile, srcDir, distDir, bundleDir, config, bundlePromises);
  return Promise.all(bundlePromises);
}

//================================ EXPORTS ===================================//

module.exports = {
  renderStyle,
  renderEjsFileFromMarkdown,
  renderEjsFilesFromMarkdown,
  renderHtmlFiles,
  removeHtmlFiles,
  transpileFile,
  transpileFileAndChildren,
  bundleFile,
  bundleFileAndChildren,
  bundleFileAndParents,
};