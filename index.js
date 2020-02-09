const logger = require('./src/app/logger');
const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const WebSocket = require('./src/app/websocket/websocket');
const session = require('express-session');
const config = require('./src/app/config');
const app = express();
const uuid = require('uuid');
const bodyParser = require('body-parser');

/* session config */
const sessionOptions = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: 'sid',
  cookie: {},
};
let sessionParser = null;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
if (config.secure) {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}
const hour = 3600000;
sessionOptions.cookie.expires = new Date(Date.now() + hour);
sessionOptions.cookie.maxAge = hour;

if (config.session.store === 'redis') {
  const redis = require('redis');
  const RedisStore = require('connect-redis')(session);
  const redisClient = redis.createClient(config.redis.port, config.redis.host);

  sessionParser = session({
    store: new RedisStore({client: redisClient}),
    ...sessionOptions,
  });
} else if (config.session.store === 'memory') {
  sessionParser = session(sessionOptions);
} else {
  logger.error(`Invalid session store type: ${config.session.store}`);
}

app.use(sessionParser);

/* security settings */

if (config.secure) {
  app.use(helmet({
    referrerPolicy: {policy: 'same-origin'},
  }));
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
  });
}
app.use((req, res, next) => {
  if (typeof process.env.NODE_APP_INSTANCE !== 'undefined')
    res.header('pm2-cluster', process.env.NODE_APP_INSTANCE);
  next();
});
app.use(compression());
/* Routes */
app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/re-support.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/client.html'));
});
app.use(express.static('public'));

app.get('/login/:room', (req, res) => {
  const id = uuid.v4();
  req.session.count = 10;
  logger.info(`Updating session for user ${id}`);
  req.session.userId = id;
  req.session.roomId = req.params.room;
  res.redirect('/');
});
// app.all('/files/*', service.filesHandler);

const port = process.env.NODE_PORT || 9845;
const server = app.listen(port);
logger.info(`Server running at port: ${port}`);

new WebSocket(server, sessionParser);
logger.info('Web Socket Running');
// pm2 start app.js -o ./out.log -e ./err.log

// pm2 start npm -- start -o ./out.log -e ./err.log
