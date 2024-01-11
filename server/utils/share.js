const { DevicePrivileges } = require('@base/constants/enums/device-privileges');

const shareFindPayload = (query) => {
  const now = new Date();
  return {
    ...query,
    $or: [
      { accessRightsFlag: { $ne: DevicePrivileges.Limited } },
      {
        $and: [
          { accessRightsFlag: DevicePrivileges.Limited },
          { startDate: { $lte: now } },
          { expiryDate: { $gte: now } },
        ],
      },
    ],
    deleted: {
      $in: [null, false],
    },
  };
};

module.exports = {
  shareFindPayload,
};
