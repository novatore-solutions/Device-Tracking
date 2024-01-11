const path = require('path');
const config = {
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.MONGODB_URL,
  appKey: process.env.APP_KEY,
  port: process.env.PORT || 3000,
  appUrl: process.env.APP_URL,
  corsWhitelist: process.env.CORS && process.env.CORS != '*' ? process.env.CORS.split(' ') : '*',
  cors: {
    whitelist: (process.env.CORS || '').split(' ').map((host) => {
      return new RegExp(host);
    }),
    credentials: true,
    origin: function (origin, callback) {
      if (typeof origin === 'undefined') return callback(null, true);
      for (let i = 0; i < config.cors.whitelist.length; i++) {
        const element = config.cors.whitelist[i];
        if (element.test(origin)) return callback(null, true);
      }
      callback(new Error(`Not allowed by CORS: "${origin}" not in "${config.cors.whitelist}"`));
    },
    optionsSuccessStatus: 200,
  },
  bearerOptions: {
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token',
  },
  cache: {
    urlCacheOptions: {
      stdTTL: 60,
      checkperiod: 70,
      deleteOnExpire: true,
    },
    proxyCacheOptions: {
      stdTTL: 600, // 10 minutes
    },
  },
  viewEngine: {
    engine: 'pug',
    options: {
      views: path.resolve(__dirname, '../templates/pages'),
    },
  },
};
module.exports = config;