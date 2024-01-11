const path = require('path');

const config = {
  appEnvironment: process.env.NODE_ENV,

  databaseUri: process.env.MONGODB_URI,

  appKey: process.env.APP_KEY,

  port: process.env.PORT || 3000,

  siteUrl: process.env.SITE_URL,

  userUrl: process.env.USER_URL,

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

  subscription: {
    apple: {
      $filter: 'env',

      prod: {
        host: 'buy.itunes.apple.com',
        path: '/verifyReceipt',
      },

      $base: {
        host: 'sandbox.itunes.apple.com',
        path: '/verifyReceipt',
      },
    },
  },
};

module.exports = config;