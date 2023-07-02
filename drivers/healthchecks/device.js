'use strict';

const { Device } = require('homey');
const hcapi = require('../../healthchecks/hcapi');

class HealthChecksDevice extends Device {

  #uuid;
  #interval;
  #hcapi;
  

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    const settings = this.getSettings();
    this.#uuid = settings.UUID;
    this.#interval = settings.interval;
    this.#hcapi = new hcapi();
    this.registerCapabilityListener("button", async () => {
      this.#doHealthChecks();
    });
    if(!this.#isEmpty(this.#uuid)) {
      this.#pollerStart();
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
    changedKeys.forEach((settingKey) => {
      if(settingKey === 'UUID') {
        this.#uuid = newSettings[settingKey];
      }
      if(settingKey === 'interval') {
        this.#interval = newSettings[settingKey];
      }
    });
    this.#pollerStop();
    if(!this.#isEmpty(this.#uuid)) {
      this.#pollerStart();
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
  }

  #doHealthChecks(){
    this.#hcapi.ping(this.#uuid, ()=>{
      this.setCapabilityValue('alarm_generic', false);
    }, () => {
      this.setCapabilityValue('alarm_generic', true);
    });
  }

  #pollerStart(){
    this.poller = setInterval(this.#doHealthChecks.bind(this), (this.#interval * 1000));
  }

  #pollerStop(){
    if(this.poller){
      clearInterval(this.poller);
    }
  }

  #isEmpty(arg){
    return ( arg == undefined || arg == null || arg.length === 0 || (typeof arg === 'object' && Object.keys(arg).length === 0) );
  }
  
}

module.exports = HealthChecksDevice;
