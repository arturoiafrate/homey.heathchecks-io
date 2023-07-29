const https = require('https');
const http = require('http');
const UrlUtils = require('../utils/urlUtils');

class hcapi {
    #options = {};
    #urlString = '';

    customize({uuid = '', port = null}){
        this.#urlString = uuid;
        this.#options = UrlUtils.getOptions({urlString: uuid, port: port});
    }

    ping(successCallback, errorCallback){
        if(!UrlUtils.isEmpty(this.#options.path)){
            const protocol = UrlUtils.isHttps(this.#urlString) ? https : http;
            const request = protocol.request(this.#options, (res) => {
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
        } else {
            if(errorCallback){
                errorCallback();
            }
        }
    }
}

module.exports = hcapi;