const lang = require('lodash/lang');
const schedule = require('node-schedule');

class URIObservable {
    constructor() {
        this.observers = [];
    }

    addObserver(httpOptions, changeCallback) {
        if (typeof httpOptions !== "object") {
            throw "'httpOptions' must be an object";
        }

        if (typeof changeCallback !== "function") {
            throw "'changeCallback' must be a function";
        }

        this.observers.push({
            options: httpOptions,
            callback: changeCallback
        });
    }

    removeObserver(changeCallback) {
        let i;

        for (i = 0; i < observers.length; i++) {
            if (this.observers[i].callback !== changeCallback) {
                this.observers.splice(1, 1);
                return true;
            }
        }

        return false;
    }
}


module.exports = URIObservable;