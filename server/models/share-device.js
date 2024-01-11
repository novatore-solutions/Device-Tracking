const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { shareFindPayload } = require('@base/utils/share');

const schema = new mongoose.Schema(
  {
    timeCreated: { type: Date },
    userId: { type: String, required: true },
    deviceUUID: { type: String, required: true },
    masterKey: { type: String, required: true },
    isOwnerFlag: { type: Number, required: true },
    accessRightsFlag: { type: Number, required: true },
    securityLevel: { type: Number, required: true },
    sharedUserWithEmail: { type: String, required: true },
    sharerName: { type: String, required: true },
    isAcceptedFlag: { type: Number, required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    message: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

schema.statics.create = async function (payload) {
  const document = new ShareDevice({
    sharedUserWithEmail: payload.sharedUserWithEmail,
    sharerName: payload.sharerName,
    isAcceptedFlag: payload.isAcceptedFlag,
    userId: payload.userId,
    deviceUUID: payload.deviceUUID,
    masterKey: payload.masterKey,
    isOwnerFlag: payload.isOwnerFlag,
    accessRightsFlag: payload.accessRightsFlag,
    securityLevel: payload.securityLevel,
    startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
    expiryDate: new Date(payload.expiryDate),
    timeCreated: new Date(),
    message: payload.message ? payload.message : '',
  });

  return document.save();
};

schema.statics.findByDeviceUUID = async function (deviceUUID, realOwnerId = null) {
  const query = { deviceUUID };
  if (realOwnerId) query.userId = realOwnerId;
  return this.findByQuery(query);
};

schema.statics.findByShareId = async function (id) {
  return this.findByQuery({ _id: ObjectId(id) });
};

schema.statics.findByQuery = async function (query) {
  return this.find({ ...shareFindPayload(query) });
};

const ShareDevice = mongoose.model('ShareDevice', schema, 'share_device');

module.exports = ShareDevice;
