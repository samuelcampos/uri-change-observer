import * as lang from 'lodash/lang';
import {Scheduler} from './scheduler';
import {HttpRequester} from './http-requester';

function processResponse(observer, response) {
    if (response.headers['last-modified']) {
        let actualLastModified = Date.parse(response.headers['last-modified']);

        if (actualLastModified > observer.status.lastModified) {
            observer.callback(response.data);
        }

        observer.status.lastModified = actualLastModified;
    } else {
        if (observer.status.data) {
            if (response.data instanceof Buffer) {
                if (Buffer.compare(response.data, observer.status.data) !== 0) {
                    observer.callback(response.data);
                }
            } else if (response.data instanceof Object) {
                if (!lang.isEqual(response.data, observer.status.data)) {
                    observer.callback(response.data);
                }
            } else {
                if (response.data !== observer.status.data) {
                    observer.callback(response.data);
                }
            }
        }

        observer.status.data = response.data;
    }
}

function processObserver(observer) {
    return HttpRequester.sendRequest(observer.options)
        .then((response) => {
            processResponse(observer, response);
        });
}

export class URIObservable {
    constructor() {
        this._observers = [];

        this._scheduler = new Scheduler(this._schedulerTick.bind(this));
    }

    _schedulerTick() {
        for (let i = 0; i < this._observers.length; i++) {
            processObserver(this._observers[i]);
        }
    }

    addObserver(httpOptions, changeCallback) {
        if (typeof httpOptions !== 'object') {
            throw '"httpOptions" must be an object';
        }

        if (typeof changeCallback !== 'function') {
            throw '"changeCallback" must be a function';
        }

        let observer = {
            options: httpOptions,
            callback: changeCallback,
            status: {}
        };

        processObserver(observer)
            .then(() => {
                this._observers.push(observer);

                if (this._observers.length === 1) {
                    this._scheduler.start();
                }
            });
            // .catch((options, error) => {
            //     console.log(error.message);
            // });
    }

    removeObserver(changeCallback) {
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].callback !== changeCallback) {
                this._observers.splice(1, 1);

                if (this._observers.length === 1) {
                    this._scheduler.stop();
                }

                return true;
            }
        }

        return false;
    }
}