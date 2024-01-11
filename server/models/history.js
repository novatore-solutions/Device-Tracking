const mongoose = require('mongoose');
const { getUTCDateTime } = require('@base/utils/dateTime');

const schema = new mongoose.Schema(
  {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    address: { type: String },
    timeCreated: { type: Date },
    deviceUUID: { type: String, required: true },
    eid: { type: String, required: false },
    unlockType: { type: Number, default: 0 },
    isLocked: { type: Boolean, required: true, default: false },
    type: { type: String, required: false },
    locationChanged: { type: Boolean, required: false, default: true },
    lastSeenOn: { type: Date, required: false },
    modem_voltage: { type: Number, default: null, required: false },
    modem_temperature: { type: Number, default: null, required: false },
    modem_temperature_c: { type: Number, default: null, required: false },
    modem_temperature_f: { type: Number, default: null, required: false },
    alertType: { type: String, default: '', required: false },
    duration: { type: Number, default: 0, required: false },
  },
  { timestamps: true },
);

schema.index({
  deviceUUID: 1,
});

schema.statics.create = async function (payload) {
  const data = {
    type: payload.type ? payload.type : '',
    latitude: payload.latitude,
    longitude: payload.longitude,
    accuracy: payload.accuracy || 0,
    deviceUUID: payload.deviceUUID,
    eid: payload.eid ? payload.eid : '',
    address: payload.address ? payload.address : '',
    unlockType: payload.unlockType ? payload.unlockType : 0,
    isLocked: payload.isLocked ? payload.isLocked : false,
    timeCreated: getUTCDateTime(payload.timestamp || ''),
    locationChanged: true,
    alertType: payload.alertType ? payload.alertType : '',
    duration: payload.duration ? payload.duration : 0,
  };

  data.lastSeenOn = data.timeCreated;

  const lastHistory = await this.findOne({ deviceUUID: payload.deviceUUID }).sort({ timeCreated: -1 });
  if (
    lastHistory &&
    ((lastHistory.latitude == data.latitude && lastHistory.longitude == data.longitude) ||
      (lastHistory.address && data.address && lastHistory.address == data.address))
  ) {
    data.locationChanged = false;
    if (lastHistory.lastSeenOn) {
      await this.updateMany(
        {
          deviceUUID: payload.deviceUUID,
          lastSeenOn: lastHistory.lastSeenOn,
          $or: [
            {
              $and: [{ latitude: data.latitude }, { longitude: data.longitude }],
            },
            { address: data.address },
          ],
        },
        { $set: { lastSeenOn: data.lastSeenOn } },
      );
    }
  }

  if (payload.eid) data.eid = payload.eid;
  const document = new History(data);
  return document.save();
};

schema.statics.findByQuery = async function (query) {
  return this.find(query).sort({ timeCreated: -1 });
};

const History = mongoose.model('History', schema, 'history');

module.exports = {
  History,
};
