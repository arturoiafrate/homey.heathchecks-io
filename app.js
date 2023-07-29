'use strict';

const Homey = require('homey');
const { Log } = require('homey-log');

class HealthChecksApp extends Homey.App {

  async onInit() {
    this.homeyLog = new Log({ homey: this.homey });
  }

}

module.exports = HealthChecksApp;
