const express = require("express");
const Device = require("@models/device");
const router = express.Router();

router.get("/devices/find", async (req, res) => {
  const device = await Device.find({})
    .sort({ timeCreated: -1 })
    .populate("esim")
    .limit(2)
    .lean();

  res.json(device);
});

router.put("/devices/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  // validate device
  let device = await Device.findById(id);
  if (!device)
    return res
      .status(404)
      .json({ success: false, message: "Device not found" });

  const fallback = (
    field,
    type = undefined,
    subField = "",
    defaultValue = undefined
  ) => {
    let value = payload[field];
    if (value && subField) value = value[subField];
    if (value !== undefined) return type ? type(value) : value;

    let prevValue = device[field];
    if (prevValue && subField) prevValue = prevValue[subField];
    return prevValue !== undefined ? prevValue : defaultValue || null;
  };

  let updateObj = {
    name: fallback("name", String),
    devicePicture: fallback("devicePicture", String),
    passcode: fallback("passcode", String),
    latitude: fallback("latitude", Number),
    longitude: fallback("longitude", Number),
    alertLevel: fallback("alertLevel", Number),
    markedByUsername: fallback("markedByUsername", String),
    markedByEmail: fallback("markedByEmail", String),
    markAsLost: fallback("markAsLost", Number),
    outOfRangeTimeout: fallback("outOfRangeTimeout", Number),
    tsaAccessible: fallback("tsaAccessible", Boolean),
    emergencyMode: fallback("emergencyMode", Boolean),
    color: fallback("color", String),
    tone: fallback("tone", Number),
    proximity: fallback("proximity", String),
    scheduleReport: fallback("scheduleReport"),
    scheduleReportInterval: fallback("scheduleReportInterval", Number, "", 60),
    listenToLock: fallback("listenToLock", Boolean),
    operatingMode: fallback("operatingMode", String, ""),
    temperature: {
      enable: fallback("temperature", Boolean, "enable", false),
      sendLocation: fallback("temperature", Boolean, "sendLocation", false),
      reAlertDuration: fallback("temperature", Number, "reAlertDuration", 300),
      condition: fallback("temperature", String, "condition", "lessOrEqual"),
      level: fallback("temperature", Number, "level", 0),
      unit: fallback("temperature", String, "unit", "c"),
    },
    waterAlarm: {
      enable: fallback("waterAlarm", Boolean, "enable", false),
      sendLocation: fallback("waterAlarm", Boolean, "sendLocation", false),
      reAlertDuration: fallback("waterAlarm", Number, "reAlertDuration", 300),
    },
    accelerometer: {
      enable: fallback("accelerometer", Boolean, "enable", false),
      ultraPowerMode: fallback(
        "accelerometer",
        Boolean,
        "ultraPowerMode",
        false
      ),
      sendLocation: fallback("accelerometer", Boolean, "sendLocation", false),
      reAlertDuration: fallback(
        "accelerometer",
        Number,
        "reAlertDuration",
        180
      ),
      sensitivity: fallback("accelerometer", Number, "sensitivity", 1),
      duration: 1, // fallback('accelerometer', Number, 'duration', 5),
    },
    ledFlash: fallback("ledFlash", Boolean),
    // pushNotification: fallback('pushNotification', Boolean),
    // emailAlerts: fallback('emailAlerts', Boolean),
    locationUpdateNotification: fallback("locationUpdateNotification", Boolean),
    sosAlertNotification: fallback("sosAlertNotification", Boolean),
    isTrialAvailed: fallback("isTrialAvailed", Boolean),
    modem_voltage: fallback("modem_voltage", Number),
    deviceType: device.deviceType,
  };
  if (payload.mapBoundaryPoints)
    updateObj.mapBoundaryPoints = payload.mapBoundaryPoints;

  if (!updateObj.accelerometer.enable && updateObj.accelerometer.ultraPowerMode)
    updateObj.accelerometer.ultraPowerMode = false;

  [updateObj] = Device.excludeGPSProperties([updateObj]);
  const update = {
    $set: updateObj,
  };

  device = await Device.findByIdAndUpdate(id, update, { new: true }).lean();
  device.lastSeenTime = device.lastHistoryTime ?? null;

  res.json(device);
});

router.delete('/devices/geo-fence/:deviceUUID', async (req, res) => {
  const { deviceUUID } = req.params;

  const device = await Device.findOne({ deviceUUID });
  if (!device) return res.status(404).json({ success: false, error: ['Device not found'] });

  await Device.updateOne({ deviceUUID }, { $unset: { geoFence: '', mapBoundaryPoints: '' } });

  res.json({ status: true, message: `Remove Geo Fence.` });
});

module.exports = router;
