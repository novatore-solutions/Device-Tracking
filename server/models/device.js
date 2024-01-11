const _ = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const ShareDevice = require('./share-device');
const {
  DeviceTypes,
  DefaultDeviceType,
  ProximityAlerts,
  DefaultProximityAlert,
  GPSReportModes,
  DefaultGPSReportMode,
  OperatingModes,
  DefaultScheduleReportMode,
  DefaultOperatingMode,
  defaultScheduleReportInterval,
} = require('@base/constants/enums/products');

const alertSettingsFields = {
  enable: { type: Boolean, default: false },
  sendLocation: { type: Boolean, default: false },
  reAlertDuration: { type: Number, default: 300 },
};

const gpsDeviceFields = {
  // Temperature alert
  temperature: {
    ...alertSettingsFields,
    condition: { type: String, enum: ['lessOrEqual', 'greaterOrEqual'], default: 'lessOrEqual' },
    level: { type: Number, default: 0 },
    unit: { type: String, enum: ['c', 'f'], default: 'c' },
  },

  // motion alert
  accelerometer: {
    ...alertSettingsFields,
    ultraPowerMode: { type: Boolean, default: false },
    sensitivity: { type: Number, default: 1 },
    duration: { type: Number, default: 1 },
  },

  geoFence: {
    enable: { type: Boolean, default: false },
    liveTrackingUnable: { type: Boolean, default: false },
    trackingTime: { type: Number, default: 0 },
  },
  waterAlarm: { ...alertSettingsFields },
  modem_voltage: { type: Number, default: 0, required: false },
  modem_temperature: { type: Number, default: 0, required: false },
  modem_temperature_c: { type: Number, default: 0, required: false },
  modem_temperature_f: { type: Number, default: 0, required: false },
  modem_state: { type: Number, default: 0, required: false },
  imei: { type: String, required: false },
  iccid: { type: String, required: false },
  isTrialAvailed: { type: Boolean, default: false },
  esim: { type: String, required: false },
  operatingMode: { type: String, enum: Object.values(OperatingModes), default: DefaultOperatingMode },
  psm_tau: { type: Number, required: false },
  psm_active_time: { type: Number, required: false },
  edrx_value: { type: Number, required: false },
  edrx_ptw: { type: Number, required: false },
  rai_value: { type: Boolean, default: false },
  scheduleReport: [String],
  scheduleReportInterval: { type: Number, default: defaultScheduleReportInterval },
  locationReportMode: { type: String, enum: Object.values(GPSReportModes), default: DefaultGPSReportMode },
  continuousReportReset: { type: Date },
  ledFlash: { type: Boolean, default: false },
  pushNotification: { type: Boolean, default: true },
  emailAlerts: { type: Boolean, default: false },
  locationUpdateNotification: { type: Boolean, default: false },
  sosAlertNotification: { type: Boolean, default: false },
  alarm: { type: Boolean, default: false },
  notificationEmails: [String],
  emergencyMode: { type: Boolean, default: false },
  firmware: { type: mongoose.Types.ObjectId, required: false, ref: 'Firmware' },
  proximity: { type: String, enum: Object.values(ProximityAlerts), default: DefaultProximityAlert },
  listenToLock: { type: Boolean, default: false },
  cellRequestsCount: { type: Number },
  cellRequestsResetOn: { type: Date },
  lastReportType: { type: String },
  mapBoundaryPoints: [[Number]],
  // geoFence: { type: Boolean, default: false },
  geoFenceRepeat: { type: Number, default: 0 },
  geoFenceEmailRepeat: { type: Number, default: 0 },
  transferredUserId: { type: String },
  continuosStartTime: { type: Date },
};

const gpsDeviceFieldsKeys = Object.keys(gpsDeviceFields);

const schema = new mongoose.Schema(
  {
    userId: { type: String },
    deviceUUID: { type: String, required: true },
    devicePicture: { type: String },
    deviceType: { type: String, enum: Object.values(DeviceTypes), default: DefaultDeviceType },
    name: { type: String },
    passcode: { type: String, required: true },
    timeCreated: { type: Date },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    alertLevel: { type: Number, default: 0 },
    lastSeenTime: { type: Date },
    lastHistoryTime: { type: Date, default: null },
    markedByUsername: { type: String },
    markedByEmail: { type: String },
    markAsLost: { type: Number, default: 0 },
    tone: { type: Number, default: 0 },
    masterKey: { type: String },
    deleted: { type: Boolean, default: false },
    outOfRangeTimeout: { type: Number },
    color: { type: String, default: null },
    tsaAccessible: { type: Boolean, default: true },

    ...gpsDeviceFields,
  },
  { timestamps: true },
);

schema.index({
  name: 1,
  deviceUUID: 1,
  imei: 1,
  iccid: 1,
  userId: 1,
  deleted: 1,
});

const fields = Object.keys(schema.paths).join(' ');

schema.statics.create = async function (payload) {
  const obj = {
    userId: payload.userId,
    deviceUUID: payload.deviceUUID,
    devicePicture: payload.devicePicture ? payload.devicePicture : '',
    deviceType: payload.deviceType || DefaultDeviceType,
    name: payload.name,
    passcode: payload.passcode,
    timeCreated: new Date(),
    latitude: payload.latitude ? payload.latitude : 0,
    longitude: payload.longitude ? payload.longitude : 0,
    alertLevel: payload.alertLevel ? payload.alertLevel : 0,
    lastSeenTime: payload.lastSeenTime ? new Date(payload.lastSeenTime) : new Date(),
    lastHistoryTime: null,
    markedByUsername: payload.markedByUsername ? payload.markedByUsername : '',
    markedByEmail: payload.markedByEmail ? payload.markedByEmail : '',
    markAsLost: payload.markAsLost ? payload.markAsLost : 0,
    tone: payload.tone ? payload.tone : 0,
    masterKey: payload.masterKey ? payload.masterKey : '',
    deleted: false,
    outOfRangeTimeout: null,
    color: payload.color || null,
    tsaAccessible: payload.tsaAccessible ? payload.tsaAccessible : true,
  };

  // handle GPS data
  if (payload.deviceType === DeviceTypes.ShieldGps) {
    obj.imei = payload.imei ? payload.imei : '';
    obj.iccid = payload.iccid ? payload.iccid : '';
    obj.esim = ObjectId(payload.esim);
    obj.operatingMode = DefaultOperatingMode;
    obj.scheduleReport = [DefaultScheduleReportMode];
    obj.accelerometer = {
      enable: true,
      ultraPowerMode: false,
      sendLocation: true,
      reAlertDuration: 900,
      sensitivity: 1,
      duration: 1,
    };
  }

  let document = new Device(obj);
  [document] = this.excludeGPSProperties([document]);
  const insertedDevice = await document.save();

  return insertedDevice;
};

schema.statics.updateQueryWithFilters = (userId, opts, deviceUUIDs = []) => {
  const query = { deleted: { $in: [null, false] } };
  const filterName = _.get(opts, 'filters.name');
  const filterType = _.get(opts, 'filters.type');
  if (filterName) query.name = new RegExp(filterName, 'i');
  if (filterType) query.deviceType = filterType;

  if (deviceUUIDs.length > 0) query.$or = [{ userId }, { deviceUUID: { $in: deviceUUIDs } }];
  else query.userId = userId;

  return query;
};

schema.statics.findByDeviceUUID = async function (deviceUUID) {
  const devices = await this.find({
    deleted: {
      $in: [null, false],
    },
    deviceUUID,
  })
    .select(fields)
    .populate('esim');

  if (devices) {
    devices.forEach((device) => {
      if (!device.deviceType) device.deviceType = DefaultDeviceType;
    });
  }

  return this.excludeGPSProperties(devices);
};

schema.statics.excludeGPSProperties = (documents) => {
  documents.forEach((document) => {
    if (!document.deviceType || document.deviceType !== DeviceTypes.ShieldGps) {
      const isDocument = document instanceof Device;
      gpsDeviceFieldsKeys.map((field) => {
        if (isDocument) document[field] = undefined;
        else delete document[field];
      });
    }
  });
  return documents;
};

schema.statics.findByEid = async function (eid) {
  return null;
};

const Device = mongoose.model('Device', schema, 'devices');

module.exports = Device;
