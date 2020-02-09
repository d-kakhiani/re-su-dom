const ENV = process.env.NODE_ENV || 'local';
const conf = require(`./config/${ENV}.json`);
module.exports = conf;
