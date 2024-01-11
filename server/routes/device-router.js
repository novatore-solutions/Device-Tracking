const express = require('express');
const Device = require('@models/device');
const router = express.Router();

router.get('/devices/find', async (req, res) => {

  const device = await Device.find({}).sort({ timeCreated: -1 }).populate('esim').limit(2).lean();

  res.json(device);
});

module.exports = router;
