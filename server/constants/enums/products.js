const DeviceTypes = {
  Airbolt: 'airbolt',
  ShieldBle: 'shield_ble',
  ShieldCard: 'shield_card',
  ShieldGps: 'shield_gps',
};

const ProximityAlerts = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
};

const GPSReportModes = {
  Once: 'once',
  Continuously: 'continuously',
};

const OperatingModes = {
  Responsiveness: 'responsiveness',
  BatteryLife: 'batteryLife',
};

const scheduleReportModes = {
  gps: 'gps',
  cell: 'cell',
  temp: 'temp',
};

const DefaultScheduleReportMode = scheduleReportModes.gps;
const DefaultDeviceType = DeviceTypes.Airbolt;
const DefaultProximityAlert = ProximityAlerts.Medium;
const DefaultGPSReportMode = GPSReportModes.Once;
const DefaultOperatingMode = OperatingModes.Responsiveness;
const defaultScheduleReportInterval = 3600; // 1h
const continuousReportInterval = 20; // Seconds

module.exports = {
  scheduleReportModes,
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
  continuousReportInterval,
};
