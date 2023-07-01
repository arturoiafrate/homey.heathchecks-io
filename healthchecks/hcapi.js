const https = require('https');

class hcapi {
    #options;

    constructor(){
        this.#options = {
            host: 'hc-ping.com',
            path: null,
            port: 443,
            method: 'GET'
        }
    }

    ping(uuid, successCallback, errorCallback){
        this.#options.path = '/' + uuid;
        const request = https.request(this.#options, (res) => {
            if(res && res.statusCode == 200){
                if(successCallback){
                    successCallback();
                }
            } else {
                if(errorCallback){
                    errorCallback();
                }
            }            
        });
        request.on('error', (err) => {
            if(errorCallback){
                errorCallback();
            }
        });
        request.end();
    }
}

module.exports = hcapi;