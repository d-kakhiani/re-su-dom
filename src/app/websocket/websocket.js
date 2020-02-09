const logger = require('../logger');
const WS = require('ws');
const PingService = require('./pingservice');
const MessageSubscriber = require('../subscriber');
const redis = require('redis');
const config = require('../config');

const users = new Map();
const memoryRedis = new Map();

class WebSocket {
  constructor(server, sessionParser) {
    this.webSocket = new WS.Server({
      verifyClient: (info, done) => {
        sessionParser(info.req, {}, () => {
          let userId = info.req.session.userId;
          try {
            let userIdFromUrl = info.req.url.slice(1);
            if (userIdFromUrl.length > 5) {
              userIdFromUrl = userIdFromUrl.split('-');
              if (userIdFromUrl.length === 3) {
                const firstNumber = parseInt(userIdFromUrl[0], 16);
                const secondNumber = parseInt(userIdFromUrl[1], 16);
                const thirdNumber = parseInt(userIdFromUrl[2], 16);
                if (firstNumber >= 100 && firstNumber <= 999 &&
                    secondNumber >= 1000 && secondNumber <= 9999 &&
                    thirdNumber >= 1000 && thirdNumber <= 9999) {
                  userId = `${firstNumber}-${secondNumber}-${thirdNumber}`;
                }
              }
            }
          } catch (e) {
            logger.error(
                'error while getting userId from socket url ' + info.req.url);
            userId = null;
          }
          info.req.userId = userId;
          logger.info(`Socket validation using ${userId} userId`);
          done(userId);
        });
      },
      server,
    });
    this.webSocket.on('error', (err) => logger.error(err));
    this.webSocket.on('connection', this._newConnection.bind(this));

    this.pingService = new PingService(this.webSocket);
    this.pingService.start();

    if (config.redis) {
      //Subscribe another channel
      this.subscriber = new MessageSubscriber();
      this.subscriber.on('message', this._messageClient.bind(this));
      this.subscriber.start();
      this.redis = redis.createClient(config.redis.port, config.redis.host);
    }

    // setInterval( this._testBroadCast.bind(this), 10000 );
  }

  _newConnection(ws, req, retry = 0) {
    if (retry > 1) {
      logger.error('Could not introspect token');
      return;
    }
    const userId = req.userId;
    const roomId = req.session.roomId;

    ws.sockId = Math.floor(Math.random() * Math.floor(10000));
    logger.info(`Websocket connection, user ${userId}, socketId ${ws.sockId}`);

    this._socketMap(users, userId, ws);

    ws.send(JSON.stringify({
      type: 'READY',
      id: ws.sockId,
    }));

    ws.on('message',
        (msg) => {

          const messageObject = JSON.parse(msg);
          this._messageClient({messageObject, userId});

        });

    ws.on('close', (event) => {
      ws.isAlive = false;
      // this._sendMessages(rooms, roomId, {type: 'close'});
      // rooms.set(roomId, []);
      // chatCounter.set(roomId, 0);

    });
  }

  _messageClient({messageObject, userId}) {

    logger.info(`Message received from ${userId} user with :${JSON.stringify(
        messageObject)}`);
    if (messageObject.type === 'direct-message') {
      if (users.has(messageObject.to)) {
        this._sendMessages(users, messageObject.to, messageObject.msg);
      } else {
        return;
      }
    } else {
      if (!users.has(userId)) {
        logger.info(
            `There is not any user with ${userId}, there are only these users: ${JSON.stringify(
                users.keys())}`);
        return;
      }
    }
    // Comes from client
    if (messageObject.type === 'waiting') {
      if (config.redis) {
        this.redis.setex(userId, 300, 'WAITING');
      } else {
        memoryRedis.set(userId, 'WAITING');
      }
    }
    // Requested by support
    if (messageObject.type === 'access') {
      // check permission for access if user is support or smtHLike that

      const sendMessage = {type: 'register-offer', toUser: userId};

      let userExists = null;

      userExists = new Promise((resolve, reject) => {
        if (config.redis) {
          this.redis.exists(messageObject.clientId, (err, reply) => {
            if (!err) {
              if (reply === 1) {
                resolve(true);
              } else {
                reject();
              }
            }
          });
        } else {
          if (memoryRedis.has(messageObject.clientId)) {
            resolve(true);
          } else {
            reject();
          }
        }
      }).then(() => {
        if (config.redis) {
          logger.info(
              `User: ${messageObject.clientId} record in redis exists: ${this.redis.get(
                  messageObject.clientId)}`);

          this.redis.publish(config.redis.messageChannel,
              JSON.stringify({
                messageObject: {
                  type: 'direct-message',
                  to: messageObject.clientId,
                  msg: sendMessage,
                },
                userId,
              }));
        } else {
          this._sendMessages(users, messageObject.clientId,
              sendMessage);
        }
      }).catch(() => {
        this._sendMessages(users, userId,
            {
              type: 'error',
              message: 'There is not any active user with id ' +
                  messageObject.clientId,
            });
      });
    }
    // Send from client
    if (messageObject.type === 'offer') {
      if (config.redis) {
        this.redis.publish(config.redis.messageChannel,
            JSON.stringify({
              messageObject: {
                type: 'direct-message',
                to: messageObject.toUser,
                msg: {
                  type: 'offer',
                  offer: messageObject.offer,
                  fromUser: userId,
                },
              },
              userId,
            }));
      } else {
        this._sendMessages(users, messageObject.toUser,
            {type: 'offer', offer: messageObject.offer, fromUser: userId});
      }
    }
    // answered from support
    if (messageObject.type === 'send-answer') {
      //  check if it comes from support
      const answer = messageObject.answer;

      if (config.redis) {
        this.redis.publish(config.redis.messageChannel,
            JSON.stringify({
              messageObject: {
                type: 'direct-message',
                to: messageObject.toUser,
                msg: answer,
              },
              userId,
            }));

        this.redis.keys(messageObject.toUser, (err, rows) => {
          for (let i = 0, j = rows.length; i < j; ++i) {
            logger.info(
                `User ${messageObject.toUser} has active connection to ${userId} and removed from waiting list result: ${rows}`);
            this.redis.del(rows[i]);
          }
        });
      } else {
        this._sendMessages(users, messageObject.toUser, answer);
        memoryRedis.delete(messageObject.toUser);
      }
    }
    // can be passed from both side (support <-> client)
    if (messageObject.type === 'candidate') {
      if (config.redis) {
        this.redis.publish(config.redis.messageChannel,
            JSON.stringify({
              messageObject: {
                type: 'direct-message',
                to: messageObject.toUser,
                msg: messageObject,
              },
              userId,
            }));
      } else {
        this._sendMessages(users, messageObject.toUser, messageObject);
      }
    }

    if (messageObject.type === 'close' || messageObject.type === 'error') {
      if (config.redis) {
        this.redis.publish(config.redis.messageChannel,
            JSON.stringify({
              messageObject: {
                type: 'direct-message',
                to: messageObject.toUser,
                msg: messageObject,
              },
              userId,
            }));
      } else {
        this._sendMessages(users, messageObject.toUser, messageObject);
      }
    }
  }

  _socketMap(map, id, ws) {
    let arr = !map.has(id) ? [] : map.get(id);
    arr.push(ws);
    map.set(id, arr);
  }

  _sendMessages(map, id, msg, exclude) {
    msg.cluster = process.env.NODE_APP_INSTANCE;
    msg = JSON.stringify(msg);
    const wsArr = map.get(id);
    if (!wsArr) {
      logger.info(`No sockets available for user: ${id}`);
      return;
    }
    const arr = [];
    const msgStr = (msg);

    for (const ws of wsArr) {

      if (ws.isAlive !== false) {
        logger.info(
            `Sending WebSocket Message using socket( ${ws.sockId} ) to user ${id}`);
        try {
          if (ws.sockId === exclude) {
            logger.info('Dont send message to ' + exclude +
                `There is ${wsArr.length} users`);
          } else {
            ws.send(msgStr);
          }
          arr.push(ws);
        } catch (e) {
          logger.error('Cleaning up web socket connection', e);
        }
      } else {
        logger.info('Cleaning up web socket connection');
      }
    }
    map.set(id, arr);
  }

  _testBroadCast() {
    this.webSocket.clients.forEach((ws) => {
      ws.send(JSON.stringify({test: 'test'}));
    });
  }
}

module.exports = WebSocket;
