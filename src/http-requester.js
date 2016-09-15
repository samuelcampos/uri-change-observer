import * as http from 'http';
import * as https from 'https';

export class HttpRequester {
    /**
     * Send a simple HTTP/HTTPS request.
     *
     * @static
     * @param {Object} options the request options
     * @returns {Promise}
     *
     * @memberOf HttpRequester
     */
    static sendRequest(options) {

        let pResult = new Promise((resolve, reject) => {
            const protocol = options.port === 443 ? https : http;

            const req = protocol.request(options, res => {
                let respChunks = [];
                // res.setEncoding('utf8');

                res.on('data', chunk => {
                    respChunks.push(chunk);
                });

                res.on('end', () => {
                    let respData = Buffer.concat(respChunks);
                    let contentType = res.headers['content-type'] && res.headers['content-type'].split(';')[0];
                    let data;

                    switch (contentType) {
                    case 'application/json':
                        data = JSON.parse(respData.toString());
                        break;

                    case 'text/html':
                    case 'text/javascript':
                    case 'application/x-javascript':
                    case 'text/css':
                        data = respData.toString();
                        break;

                    default:
                        data = respData;
                    }

                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                });
            });

            req.on('error', err => {
                reject(options, err);
            });

            req.end();
        });

        return pResult;
    }
}