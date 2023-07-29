
class UrlUtils {

    static isValidUrl(urlString) {
        try {
            const url = new URL(urlString);
            return true; 
        } catch(e){ 
            return false; 
        }
    }

    static isHttps(urlString){
        if(!this.isValidUrl(urlString)){//If urlString is not a valid URL, it is an UUID. So the default is https
            return true;
        }
        try {
            const url = new URL(urlString);
            return url.protocol === 'https:';
        } catch(e){ 
            return false; 
        }
    }

    static getBaseUrl(urlString){
        try {
            const url = new URL(urlString);
            return url.hostname;
        } catch(e){ 
            return false; 
        }
    }

    static getPath(urlString){
        try {
            const url = new URL(urlString);
            return url.pathname;
        } catch(e){ 
            return false; 
        }
    }

    static isEmpty(arg){
        return ( arg == undefined || arg == null || arg.length === 0 || (typeof arg === 'object' && Object.keys(arg).length === 0) );
    }

    static getOptions({urlString = '', port = null}){
        const options = { //Default options
            host: 'hc-ping.com',
            path: null,
            port: 443,
            method: 'GET'
        }
        if(this.isEmpty(urlString)){//If the UUID is empty, return the default options (no checks will be done)
            return options; 
        }
        if(!this.isValidUrl(urlString)){//If the UUID is not a valid URL, use it as a path
            options.path = '/' + urlString;
            return options;
        }
        const baseUrl = this.getBaseUrl(urlString);
        if(!baseUrl){
            return options;
        }
        if(!this.isEmpty(port) && port > 0){
            options.port = port;
        } else {
            if(this.isHttps(urlString)){
                options.port = 443;
            } else {
                options.port = 80;
            }
        }
        options.host = baseUrl;
        options.path = this.getPath(urlString);
        return options;
    }
}

module.exports = UrlUtils;