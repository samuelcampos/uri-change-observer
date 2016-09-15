const chai = require('chai');
const expect = chai.expect;
import {URIObservable} from '../src/uri-observable';

describe('Add/Remove observers', () => {
    let observable;

    beforeEach(() => {
        observable = new URIObservable();
    });

    describe('Invalid parameters', () => {
        it('should throw and error when the "httpOptions" is not an object', () => {
            expect(() => {
                observable.addObserver();
            }).to.throw('"httpOptions" must be an object');
        });

        it('should throw and error when the "changeCallback" is not a function', () => {
            expect(() => {
                observable.addObserver({});
            }).to.throw('"changeCallback" must be a function');
        });
    });
});