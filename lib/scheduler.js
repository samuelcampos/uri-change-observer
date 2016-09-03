const httpRequester = require('./http-requester');


console.log('init', lang)
let j = schedule.scheduleJob('*/1 * * * *', () => {
  console.log('The answer to life, the universe, and everything!');
});