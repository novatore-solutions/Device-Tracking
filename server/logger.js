const winston = require('winston');

const config = require('./config');

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.json(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.printf((info) => {
    let {
      timestamp,
      level,
      message,
      metadata: { timestamp: metaTimestamp, models, ...metadata },
    } = info;

    if (models && !Array.isArray(models)) {
      models = [models];
    }

    if (models) {
      const maskableKeys = ['password', 'masterKey', 'devicePicture'];

      models = models
        .filter((model) => !!model.toJSON)
        .map((model) => {
          var data = model.toJSON();

          maskableKeys.forEach((key) => {
            if (data[key]) data[key] = '############';
          });

          return data;
        });

      if (models.length === 1) {
        models = models[0];
      }
    }

    const ts = (timestamp || metaTimestamp).slice(0, 19).replace('T', ' ');

    const payload = {
      message: message,
    };

    if (models && models.length) {
      payload.models = models;
    }

    if (metadata && Object.keys(metadata).length) {
      payload.metadata = metadata;
    }

    return `${ts} [${level}]: ${JSON.stringify(payload)}`;
  }),
  winston.format.colorize({ all: true }),
);

const transports = [
  new winston.transports.Console({
    level: config.logLevel,
    format: alignedWithColorsAndTime,
  }),
];

const logger = winston.createLogger({
  level: config.logLevel,
  transports,
});

module.exports = logger;

if (require.main === module) {
  const obj = { _id: '123', a: { b: 1, c: { d: [1, 2, 3, 4], e: { _id: '456', name: 'child' } } } };
  const error = new Error('Something bad happened');

  logger.info('Information message with object', { obj, models: [{}, {}] });
  logger.info('Information message with error', error);

  logger.warn('Warning message with object', { obj, models: [{}, {}] });
  logger.warn('Warning message with error', error);

  logger.error('Error message with object', { obj, models: [{}, {}] });
  logger.error('Error message with error', error);
  logger.error('Error occurs:', error);
}
