import {URIObservable} from '../src/uri-observable';
import {HttpRequester} from '../src/http-requester';
import * as scheduler from '../src/scheduler';

describe('URIObservable', () => {
    const env = jasmine.getEnv();
    let observable;
    let schedulerMock;

    beforeEach(() => {
        schedulerMock = jasmine.createSpyObj('Scheduler', ['start', 'stop', 'isActive']);

        env.spyOn(HttpRequester, "sendRequest");
        env.spyOn(scheduler, "Scheduler").and.returnValue(schedulerMock);

        observable = new URIObservable();
    });

    describe('constructor', () => {
        it('should create a new Scheduler registering a tick method', () => {
            expect(scheduler.Scheduler).toHaveBeenCalledWith(jasmine.any(Function));
        });
    });

    describe('addObserver method', () => {
        describe('Invalid parameters', () => {
            it('should throw and error when the "httpOptions" is not an object', () => {
                expect(() => {
                    observable.addObserver();
                }).toThrow('"httpOptions" must be an object');
            });

            it('should throw and error when the "changeCallback" is not a function', () => {
                expect(() => {
                    observable.addObserver({});
                }).toThrow('"changeCallback" must be a function');
            });
        });

        it('should send a request using the HttpRequester and invoke scheduler start', done => {
            HttpRequester.sendRequest.and.callFake(() => {
                return new Promise(resolve => {
                    resolve({
                        statusCode: 200,
                        headers: {},
                        data: 'response'
                    });
                });
            });

            const callbackSpy = jasmine.createSpy('callbackSpy');
            const requestOptions = {
                host: 'samuelcampos.net'
            };

            observable.addObserver(requestOptions, callbackSpy)
                .then(() => {
                    expect(schedulerMock.start).toHaveBeenCalled();

                    done();
                });

            expect(HttpRequester.sendRequest).toHaveBeenCalledWith(requestOptions);

            // Scheduler.start should not be invoked yet
            expect(schedulerMock.start).not.toHaveBeenCalled();
        })
    });
});