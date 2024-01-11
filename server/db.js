const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');
const { History } = require('./models/history');
const Device = require('./models/device');
const { DeviceTypes } = require('./constants/enums/products');

module.exports.db = null;

const history = {
  alertType: 'Schedule',
  deviceUUID: '999999999999911',
  modem_voltage: 4000,
  modem_temperature: 20,
  type: 'gps',
  latitude: -36.7463843,
  longitude: 174.7223271,
  accuracy: 20,
  duration: 10,
  address: 'Auckland Northern Motorway, Rosedale, Upper Harbour, Auckland, 0732, New Zealand',
  locationChanged: false,
};

const device = {
  name: 'GPS device',
  passcode: '0000',
  deviceUUID: '999999999999911',
  imei: '999999999999911',
  deviceType: DeviceTypes.ShieldGps,
  iccid: '8931089418124263894F',
};

const seedDb = async () => {
  try {
    await History.deleteMany({});
    await Device.deleteMany({});
    await History.create(history);
    await Device.create(device);
    console.log('Data seeded successful');
  } catch (error) {
    console.error('Error while seeding data:', error);
  }
};

module.exports.initialize = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(config.databaseUrl, options);
    module.exports.db = mongoose.connection;

    module.exports.db.on('error', reject);
    module.exports.db.once('open', () => {
      resolve();
    });

    seedDb();

    if (config.debug) {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`${collectionName}.${method}( ${JSON.stringify(query)} ) = ${JSON.stringify(doc)}`);
      });
    }
  });
};

module.exports.shutdown = async () => {
  if (module.exports.db) {
    await module.exports.db.close().then(() => {
      module.exports.db = null;
    });
  }
};
