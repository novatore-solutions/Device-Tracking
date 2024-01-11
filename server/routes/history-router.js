const express = require('express');
const middleware = require('@base/middleware');
const { History } = require('@models/history');
const Device = require('@models/device');
const utils = require('@base/utils');
const { DeviceTypes, scheduleReportModes } = require('@base/constants/enums/products');
const { cToF } = require('@base/utils/temperature');
const router = express.Router();

const PER_PAGE = 10;
const PAGE_LIMIT = 20;
const MAX_LIMIT = PER_PAGE * PAGE_LIMIT;

router.get('/device-history/:deviceUUID', async (req, res) => {
  const { deviceUUID } = req.params;

  // validate device
  const device = await Device.findOne({ deviceUUID });
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

  let { perPage } = utils.unpackQuery(req);
  perPage = perPage || PER_PAGE;

  const histories = await History.find({
    deviceUUID,
    $and: [
      { latitude: { $exists: true, $ne: null } },
      { longitude: { $exists: true, $ne: null } },
      { timeCreated: { $exists: true, $ne: null } },
    ],
    $or: [{ locationChanged: { $exists: 0 } }, { locationChanged: true }],
  })
    .sort({ timeCreated: -1 })
    .limit(perPage)
    .select(
      'latitude longitude timeCreated lastSeenOn type address modem_voltage modem_temperature alertType duration',
    )
    .lean();

  return res.json(histories);
});

router.get('/find-device-history/:deviceUUID', async (req, res) => {
  const { deviceUUID } = req.params;

  // validate device
  const device = await Device.findOne({ deviceUUID });
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

  const query = { deviceUUID };
  let { page, perPage } = utils.unpackQuery(req);
  perPage = PER_PAGE;

  let total = await History.count(query);
  if (total > MAX_LIMIT) total = MAX_LIMIT;

  if (page > PAGE_LIMIT)
    return res.json({
      success: true,
      data: [],
      pagination: utils.pagination(page, perPage, total),
    });

  const histories = await History.find(query)
    .sort({ timeCreated: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage);

  return res.json({
    success: true,
    data: histories,
    pagination: utils.pagination(page, perPage, total),
  });
});


module.exports = router;
