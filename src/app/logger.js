const winston = require('winston');
const config = require('./config');

const LogFileSize = 5242880; // 5MB

/**
 * winston logger wrapper
 * @module logger
 * @type {DerivedLogger}
 */
module.exports = logger = winston.createLogger({
  transports: [],
  exitOnError: false,
});

if (config.logLevel !== 'none') {
  logger.add(
      new winston.transports.File({
        level: 'warn',
        filename: './logs/error.log',
        handleExceptions: true,
        json: true,
        maxsize: LogFileSize,
        maxFiles: 5,
        colorize: false,
      }),
  );
}else {
  logger.add(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  }));
}

if (config.logLevel === 'info') {

  logger.add(new winston.transports.File({
    filename: './logs/info.log',
    handleExceptions: true,
    json: true,
    maxsize: LogFileSize,
    maxFiles: 5,
    colorize: false,
  }));

  logger.add(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  }));
}
