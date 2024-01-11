const voltage_to_capacity = (voltage) => {
  const lut = [
    [4200, 100],
    [4150, 95],
    [4110, 90],
    [4080, 85],
    [4020, 80],
    [3980, 75],
    [3950, 70],
    [3910, 65],
    [3870, 60],
    [3850, 55],
    [3840, 50],
    [3820, 45],
    [3800, 40],
    [3790, 35],
    [3770, 30],
    [3750, 25],
    [3730, 20],
    [3710, 15],
    [3690, 10],
    [3610, 5],
    [3270, 0],
  ];

  const closest = lut.reduce((prev, curr) => (Math.abs(curr[0] - voltage) < Math.abs(prev[0] - voltage) ? curr : prev));
  return closest[1] > 100 ? 100 : closest[1];
};

module.exports = {
  voltage_to_capacity,
};
