// const lang = require('lodash/lang');
import {Scheduler} from './scheduler';
import {HttpRequester} from './http-requester';

export class URIObservable {
    constructor() {
        this._observers = [];

        this._scheduler = new Scheduler(this._schedulerTick.bind(this));
    }

    _schedulerTick() {
        for (let i = 0; i < this._observers.length; i++) {
            let observer = this._observers[i];

            HttpRequester.sendRequest(observer.options, observer.callback);
        }
    }

    addObserver(httpOptions, changeCallback) {
        if (typeof httpOptions !== 'object') {
            throw '"httpOptions" must be an object';
        }

        if (typeof changeCallback !== 'function') {
            throw '"changeCallback" must be a function';
        }

        this._observers.push({
            options: httpOptions,
            callback: changeCallback
        });

        if (this._observers.length === 1) {
            this._scheduler.start();
        }
    }

    removeObserver(changeCallback) {
        let i;

        for (i = 0; i < this._observers.length; i++) {
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