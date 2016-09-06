// const http = require('http');
// const https = require("https");
import * as http from 'http';
import * as https from 'https';

export class HttpRequester {
    static sendRequest(options, onResult) {
        const protocol = options.port === 443 ? https : http;

        const req = protocol.request(options, (res) => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            let output = '';
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                output += chunk;
            });

            res.on('end', () => {
                let obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });

        req.on('error', function (err) {
            console.log('error: ' + err.message);
        });

        req.end();
    }
}