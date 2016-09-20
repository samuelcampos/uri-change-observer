import * as lang from 'lodash/lang';
import {Scheduler} from './scheduler';
import {HttpRequester} from './http-requester';

function processResponse(observer, response) {
    let actualLastModified;

    if (response.headers['last-modified']) {
        actualLastModified = Date.parse(response.headers['last-modified']);

        if (actualLastModified > observer.status.lastModified) {
            observer.callback(response.data);
        }
    } else {
        if (observer.status.lastData) {
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
    }

    observer.status.lastModified = actualLastModified;
    observer.status.lastData = response.data;
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
            status: {
                lastModified: undefined,
                lastData: undefined
            }
        };

        return processObserver(observer)
            .then(() => {
                this._observers.push(observer);

                if (this._observers.length === 1) {
                    this._scheduler.start();
                }
            });
    }

    removeObserver(changeCallback) {
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].callback === changeCallback) {
                this._observers.splice(1, 1);

                if (this._observers.length === 1) {
                    this._scheduler.stop();
                }

                return true;
            }
        }

        return false;
    }

    getLastKnownStatus(changeCallback) {
        for (let i = 0; i < this._observers.length; i++) {
            if (this._observers[i].callback === changeCallback) {
                return this._observers[i].status;
            }
        }
    }
}