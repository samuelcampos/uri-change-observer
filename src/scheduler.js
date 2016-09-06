import * as schedule from 'node-schedule';

export class Scheduler {

    /**
     * Creates an instance of Scheduler.
     *
     * @param {Function} callback the method to be invoked
     */
    constructor(callback) {
        this.callback = callback;
    }

    start() {
        this.job = schedule.scheduleJob('*/1 * * * *', this.callback);
    }

    stop() {
        if (this.job) {
            this.job.cancel();
            delete this.job;
        }
    }

    /**
     *
     *
     * @returns {boolean} true if this Scheduler is active, false otherwise
     */
    isActive() {
        return !!this.job;
    }
}