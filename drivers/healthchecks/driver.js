'use strict';

const { Driver } = require('homey');

class HealthChecksDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {}

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return [
      {
        name: 'HealthChecks',
        data: {
          id: 'healthchecks-00',
        },
      },
    ];
  }

}

module.exports = HealthChecksDriver;
