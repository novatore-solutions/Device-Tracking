const { DeviceTypes } = require('@base/constants/enums/products');

const fToC = (temp) => (temp - 32) / 1.8;
const cToF = (temp) => {
  if (temp == null || temp == undefined) return null;
  return parseInt((9 * temp + 160) / 5);
};



const handleTempUnit = (value, unit) => {
  if (unit === 'c') return `${value} °C`;

  let temp = cToF(value);
  if (!temp) return 'N/A';
  temp = parseInt(temp.toString());

  return `${temp} °F`;
};

module.exports = {
  fToC,
  cToF,
  handleTempUnit,
};
