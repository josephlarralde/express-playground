const http = require('http');
const childProcess = require('child_process');
const logger = require('./logger');

const fork = childProcess.fork;
const spawn = childProcess.spawn;
const exec = childProcess.exec;

function MyServer(serverIndexPath) {
  this.serverIndexPath = serverIndexPath;
  this.server = null;
};

MyServer.prototype.start = function() {
  const task = 'starting server';
  logger.notifyServerTask(task);

  // this.errChunks = [];
  // const that = this;

  this.server = fork(this.serverIndexPath, {
    // leave default values (comment out stdio) and comment out this.server's
    // stderr / stdout .on('data') callbacks to let the child process pipe its
    // output to the main console :

    // stdio: [ 'ignore', childProcess.stdout, childProcess.stderr, 'ipc' ]
  });

  // aggressively kill the server on first received error
  /*
  this.server.stderr.on('data', function(err) {
    // that.errChunks.push(err);
    logger.notifyTaskError(task, err);
    that.stop();
  });
  //*/

  // this.server.stderr.on('end', function(err) {
  //   logger.notifyTaskError(task, that.errChunks.join());
  //   that.stop();
  // });

  // log normal messages from normally
  /*
  this.server.stdout.on('data', function(msg) {
    console.log(msg.toString());
  });
  //*/

  // this.server.stdout.on('end', function() {
  //   console.log('end stdout');
  // });
};

MyServer.prototype.stop = function() {
  if (this.server !== null) {
    logger.notifyServerTask('killing server');
    this.server.kill();
    this.server = null;
  }
};

MyServer.prototype.restart = function() {
  this.stop();
  this.start();
};

module.exports = MyServer;