require('module-alias/register');

const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const http = require('http');
const RateLimit = require('express-rate-limit');
const morgan = require('morgan');
const listEndpoints = require('express-list-endpoints');

const logger = require('@base/logger');
const config = require('@base/config');
const db = require('@base/db');
const errorHandlers = require('@base/routes/error-handlers');
const middleware = require('@base/middleware');

const historyRouter = require('@base/routes/history-router');
const deviceRouter = require('@base/routes/device-router');

const listAllEndpoints = (app) => {
  const endpoints = listEndpoints(app);

  const flatEndpoints = _.chain(endpoints)
    .map((ep) => {
      if (ep.path !== '*') return ep.methods.map((method) => `${method.padEnd(6, ' ')} ${ep.path}`);
      return [];
    })
    .flatten()
    .value();

  console.log(flatEndpoints);
};

const promiseApp = async () => {
  return new Promise((resolve, reject) => {
    var app = express();

    app.disable('x-powered-by');
    app.enable('trust proxy');

    app.use(morgan('combined'));

    if (config.rateLimitOn) app.use(new RateLimit(config.rateLimitOptions));

    app.use(middleware.redirectToHttps);

    app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
    app.use(methodOverride());

    app.set('view engine', config.viewEngine.engine);
    app.set('views', config.viewEngine.options.views);

    app.use(cors(config.cors));
    app.options('*', cors(config.cors));

    app.use(middleware.compression);
    app.use('/public', middleware.staticFileMiddleware);

    app.use(bodyParser.json({ limit: '20mb' }));

    app.use('/api', historyRouter);
    app.use('/api', deviceRouter);

    app.use(errorHandlers.error);
    app.use(errorHandlers.notFound);

    app.use(middleware.history);

    listAllEndpoints(app);

    resolve(app);
  });
};

const promiseServer = async (app) => {
  return new Promise((resolve, reject) => {
    const server = http.Server(app);
    resolve(server);
  });
};

const promiseRun = (server) => {
  return new Promise((resolve, reject) => {
    server.listen(config.port, () => {
      logger.info('Server started and listening on the port ' + config.port);
      resolve();
    });
  });
};

async function initialize() {
  await db.initialize();
  logger.info('Database connection initialized. ');

  const app = await promiseApp();
  const server = await promiseServer(app);
  logger.info('Server initialized.');

  await promiseRun(server);
}

initialize();
