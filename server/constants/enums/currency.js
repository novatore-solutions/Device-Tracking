const currencyNames = {
  usd: 'usd',
  aud: 'aud',
  nzd: 'nzd',
  eur: 'eur',
  gbp: 'gbp',
};

const currencies = [
  {
    text: 'USD',
    value: currencyNames.usd,
    symbol: '$',
  },
  {
    text: 'AUD',
    value: currencyNames.aud,
    symbol: '$',
  },
  {
    text: 'NZD',
    value: currencyNames.nzd,
    symbol: '$',
  },
  {
    text: 'EUR',
    value: currencyNames.eur,
    symbol: '€',
  },
  {
    text: 'GBP',
    value: currencyNames.gbp,
    symbol: '£',
  },
];

const defaultCurrency = currencyNames.usd;
const currencyNamesList = Object.values(currencyNames);

module.exports = {
  currencyNames,
  currencies,
  defaultCurrency,
  currencyNamesList,
};
