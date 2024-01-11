const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');
const compression = require('compression');
const logger = require('@base/logger');
const validation = require('@base/validation');

module.exports = exports = {};

exports.redirectToHttps = (req, res, next) => {
  if (process.env.HEROKU_APP_NAME) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.hostname + req.originalUrl);
    }
  }

  return next();
};

exports.validate = (schema, source, validationOpts) =>
  function (req, res, next) {
    if (!source) {
      source = (request, response) => {
        return request.body;
      };
    }

    validationOpts || (validationOpts = { allowUnknown: true });

    const dataToValidate = source(req, res);
    const { error, message, value } = validation.validate(dataToValidate, schema, validationOpts);

    if (error) {
      logger.warn(`Payload validation error:`, error);
      return res.status(400).json({ error, message, success: false });
    }

    req.schema = schema;
    req.values = value;

    return next();
  };

// STATIC CONTENT serving

exports.compression = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
});

exports.staticFileMiddleware = express.static(path.join(__dirname, '../public'));

exports.history = history({
  disableDotRule: true,
  verbose: true,
});
