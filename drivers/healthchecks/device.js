'use strict';

const { Device } = require('homey');
const hcapi = require('../../healthchecks/hcapi');

class HealthChecksDevice extends Device {

  #uuid;
  #port;
  #interval;
  #hcapi;
  

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    const settings = this.getSettings();
    this.#uuid = settings.UUID;
    this.#interval = settings.interval;
    this.#port = settings.port;
    this.#hcapi = new hcapi();
    this.registerCapabilityListener("button", async () => {
      this.#doHealthChecks();//Do a health check when the button is pressed
    });
    this.#pollerStop();
    if(!this.#isEmpty(this.#uuid)) {
      this.#hcapi.customize({uuid: this.#uuid, port: this.#port});
      this.#pollerStart();//If the UUID is set, start the poller
    }
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {}

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    changedKeys.forEach((settingKey) => {//Bind the new settings to the device
      if(settingKey === 'UUID') {
        this.#uuid = newSettings[settingKey];
      }
      if(settingKey === 'interval') {
        this.#interval = newSettings[settingKey];
      }
      if(settingKey === 'port') {
        this.#port = newSettings[settingKey];
      }
    });
    this.#pollerStop(); //Stop the poller
    this.#hcapi.customize({uuid: this.#uuid, port: this.#port});
    if(!this.#isEmpty(this.#uuid)) {
      this.#pollerStart();
      this.#doHealthChecks();//Do a health check when the settings are changed
      return this.homey.__("settings_scheduling_ok", { interval: this.#interval });
    } else {
      return this.homey.__("settings_scheduling_ko");
    }
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {}

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.#pollerStop();
    let id = this.getData().id;
    this.homey.app.removeDevice(id);
  }

  #doHealthChecks(){
    this.#hcapi.customize({uuid: this.#uuid, port: this.#port});
    this.#hcapi.ping(()=>{
      this.setCapabilityValue('alarm_generic', false);
      if(this.retryPoller){//If the retry poller is running, stop it
        this.#retryPollerStop();
      }
    }, () => {
      this.setCapabilityValue('alarm_generic', true);
      if(!this.retryPoller){//If the retry poller is not already running, start it
        this.#retryPollerStart();
      }
    });
  }

  //Start a poller to do health checks
  #pollerStart(){
    this.poller = this.homey.setInterval(this.#doHealthChecks.bind(this), (this.#interval * 1000));
  }

  //Start a second poller to do health checks. This is used when the device goes offline to check if it is back online
  #retryPollerStart(){
    this.retryPoller = this.homey.setInterval(this.#doHealthChecks.bind(this), 120000); //Every 2 minutes
  }

  //Stop the retry poller if it is running
  #retryPollerStop(){
    if(this.retryPoller){
      this.homey.clearInterval(this.retryPoller);
    }
    this.retryPoller = undefined;
  }

  //Stop the poller if it is running
  #pollerStop(){
    if(this.poller){
      this.homey.clearInterval(this.poller);
    }
    this.poller = undefined;
    this.#retryPollerStop();
  }

  //Check if a variable is empty/null/undefined
  #isEmpty(arg){
    return ( arg == undefined || arg == null || arg.length === 0 || (typeof arg === 'object' && Object.keys(arg).length === 0) );
  }
  
}

module.exports = HealthChecksDevice;
