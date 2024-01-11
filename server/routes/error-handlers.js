const logger = require('../logger');
const { HttpError } = require('../utils/errors');

module.exports = exports = {};

exports.error = async function (err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message, ...err.data });
  }

  logger.error('Unhandled server error, return Http 500:', err);
  return res.status(500).json({ success: false, message: err.message || err.toString() });
};

exports.notFound = function (req, res, next) {
  logger.warn(`Endpoint ${req.method} ${req.url} not found`);
  return res.status(404).json({ success: false, message: 'Requested page not found.' });
};
