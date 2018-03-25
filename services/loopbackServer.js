'use strict';

const boot = require('loopback-boot');
const loopbackApp = require('../server/server');

module.exports = class LoopbackServer {
  constructor(serviceContext) {
    this.config = serviceContext.config;
    this.logger = serviceContext.logger;
  }
  async start() {
    // Bootstrap the application, configure models, datasources and middleware.
    // Sub-apps like REST API are mounted via boot scripts.
    await new Promise((resolve, reject) => {
      boot(loopbackApp, 'server', (err) => {
        if (err) throw err;

        this.server = loopbackApp.start(() => {
          resolve();
        });

        console.log(`Process ${process.pid} LoopbackServer is now listening on http://localhost:3000/api`);
      });
    });
  }

  async stop() {
    await new Promise((resolve, reject) => {
      this.server.close(resolve);
    });
    console.log(`Process ${process.pid} LoopbackServer stopped.`);
  }

}