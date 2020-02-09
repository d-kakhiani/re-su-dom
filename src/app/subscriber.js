const EventEmitter = require('events');
const redis = require('redis');
const config = require('./config');
const logger = require('./logger');

class MessageSubscriber extends EventEmitter {
  start() {
    this.redis = redis.createClient(config.redis.port, config.redis.host);
    this.redis.on('subscribe', this._subscribe.bind(this));
    this.redis.on('message', this._messageReceived.bind(this));
    this.redis.subscribe(config.redis.messageChannel);
  }

  _subscribe(channel, count) {
    logger.info(`Subscribed to channel: ${channel}`);
  }

  _messageReceived(channel, message) {
    // try {
    logger.info(`Received message on channel: ${channel}; message: ${message}`);
    const object = JSON.parse(message);
    this.emit('message', object);
    // } catch (e) {
    //   logger.error(`Invalid JSON message, ${typeof message}`);
    //   logger.error(message);
    //   logger.error(e.message);
    //   logger.error(e.stack);
    // }
  }
}

module.exports = MessageSubscriber;
