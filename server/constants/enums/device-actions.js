const { handleTempUnit } = require('@base/utils/temperature');
const { voltage_to_capacity } = require('@base/utils/voltageToCapacity');
const config = require('@base/config');

const DeviceAction = {
  GeofencingOn: 'geofencing_on',
  GeofencingOff: 'geofencing_off',
  SosOn: 'sos_on',
  SosOff: 'sos_off',
  TemperatureSensorOn: 'temperature_sensor_on',
  TemperatureSensorOff: 'temperature_sensor_off',
  WaterSensorOn: 'water_sensor_on',
  WaterSensorOff: 'water_sensor_off',
  AccelerometerSensorOn: 'accelerometer_sensor_on',
  AccelerometerSensorOff: 'accelerometer_sensor_off',
  ReportFreq: 'report_freq',
  Sensitivity: 'sensitivity',
};

const GPSAlertTypes = (device, message) => {
  let response = null;
  const redirectURL = `${config.userUrl}/device/${device.deviceUUID}`;
  switch (message.alertType) {
    case 'Motion': {
      response = {
        email: {
          subject: 'Motion Alert!',
          title: 'Motion Alert! 🏃‍♂️',
          message: `${device.name} has moved.`,
          redirectURL,
        },
      };
      break;
    }
    case 'Water': {
      response = {
        email: {
          subject: 'Water Alert!',
          title: 'Water Alert! 💧',
          message: `${device.name} has detected Water.`,
          redirectURL,
        },
      };
      break;
    }
    case 'SOS': {
      response = {
        email: {
          subject: 'SOS Alert!',
          title: 'SOS Alert! 🚨',
          message: `SOS Alert from ${device.name}.`,
          redirectURL,
        },
      };
      break;
    }
    case 'Temperature': {
      response = {
        email: {
          subject: 'Temperature Alert!',
          title: 'Temperature Alert! 🌡️',
          message: `${device.name} is reporting a temperature of ${handleTempUnit(
            message.temperature,
            device.temperature?.unit ?? 'c',
          )}.`,
          redirectURL,
        },
      };
      break;
    }
    case 'Battery': {
      if (message.voltage) {
        const batteryPercentage = voltage_to_capacity(message.voltage);
        if (batteryPercentage <= 30) {
          response = {
            email: {
              subject: batteryPercentage <= 15 ? 'Battery Critical Alert!' : 'Battery Low Alert!',
              title: batteryPercentage <= 15 ? 'Battery Critical Alert! 🪫' : 'Battery Low Alert! 🪫',
              message:
                batteryPercentage <= 15
                  ? `The Battery of ${device.name} is critical, please charge immediately.`
                  : `The Battery of ${device.name} is low, please charge now.`,
              redirectURL,
            },
          };
        }
      }
      break;
    }
    case 'GeoFenceAlert': {
      response = {
        email: {
          subject: 'Geo-fence triggered!',
          title: 'Geo-fence Triggered! 🌍',
          message: `The geo-fence alert for ${device.name}. has been triggered.`,
          redirectURL,
        },
      };
      break;
    }
  }

  return response;
};

const GPSPushNotificationData = (device, type, message = {}) => {
  let response = null;
  const redirectURL = `airbolt://deviceDetail?id=${device.deviceUUID}`;
  switch (type) {
    case 'Motion': {
      const notificationObject = {
        title: `${device.name}: Motion Alert`,
        body: `${device.name} has moved.`,
      };

      response = {
        notification: notificationObject,

        data: {
          ...notificationObject,
          url: `${redirectURL}&action=tracking`,
        },
      };
      break;
    }
    case 'Water': {
      const notificationObject = {
        title: `${device.name}:  Water Detected`,
        body: `${device.name}  has detected Water.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: redirectURL,
        },
      };
      break;
    }
    case 'SOS': {
      const notificationObject = {
        title: `SOS Alert by ${device.name}`,
        body: `SOS Alert from ${device.name}.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: `${redirectURL}&action=tracking`,
        },
      };
      break;
    }
    case 'Temperature': {
      const notificationObject = {
        title: `${device.name}: Temperature Alert`,
        body: `${device.name} has reported a temperature of ${handleTempUnit(
          message.temperature,
          device.temperature?.unit ?? 'c',
        )}.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: redirectURL,
        },
      };
      break;
    }
    case 'Battery': {
      if (message.voltage) {
        const batteryPercentage = voltage_to_capacity(message.voltage);
        if (batteryPercentage <= 30) {
          const notificationObject = {
            title: `${device.name}: Battery Critical`,
            body: ` The Battery of ${device.name} is critical, please charge immediately.`,
          };
          response = {
            notification: notificationObject,
            data: {
              ...notificationObject,
              url: redirectURL,
            },
          };
        }
      }
      break;
    }
    case 'Remind Email': {
      const notificationObject = {
        title: `${device.name}: Unable to provide location`,
        body: `${device.name} name is not activated. To be able to track your valuables, please activate subscription by clicking here.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: `${redirectURL}&action=activateGPS`,
        },
      };
      break;
    }
    case 'Remind Firmware': {
      const notificationObject = {
        title: `${device.name}: Firmware Update Available`,
        body: `A firmware update is available for ${device.name}. Please click here to update.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: `${redirectURL}&action=firmwareUpgrade`,
        },
      };
      break;
    }
    case 'Check Firmware': {
      const notificationObject = {
        title: `${device.name}: Firmware Update Available`,
        body: `Please check for software updates.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: `${redirectURL}&action=firmwareUpgrade`,
        },
      };
      break;
    }
    case 'Geo Fence': {
      const notificationObject = {
        title: `${device.name}: Geo-fence triggered`,
        body: `The geo-fence alert for ${device.name}. has been triggered.`,
      };
      response = {
        notification: notificationObject,
        data: {
          ...notificationObject,
          url: `${redirectURL}&action=tracking`,
        },
      };
      break;
    }
  }
  if (response) {
    response.android = {
      notification: {
        sound: 'default',
      },
    };
    response.apns = {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    };
  }
  return response;
};

module.exports = {
  DeviceAction,
  GPSAlertTypes,
  GPSPushNotificationData,
};
