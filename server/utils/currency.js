const { currencies, defaultCurrency, currencyNamesList } = require('@base/constants/enums/currency');
const { Countries } = require('@base/constants/enums/countries');

const getCurrencySymbol = (currency) => {
  const obj = currencies.find((item) => item.value.toLowerCase() === currency.toLowerCase());
  return obj.symbol ?? '';
};

const getCurrency = (country) => {
  if (country) {
    const countryInfo = Countries.find((item) => item.value.toLowerCase() === country.toLowerCase());
    return countryInfo?.isoCode ? countryInfo?.isoCode : defaultCurrency;
  }
  return defaultCurrency;
};

const getFormattedCurrency = (currency) => {
  if (!currency) return '';
  currency = currency.replace(/\s/g, '').toLowerCase();
  const currenciesList = currencyNamesList;
  if (!currenciesList.includes(currency)) return defaultCurrency;
  return currency;
};

module.exports = {
  getCurrencySymbol,
  getCurrency,
  getFormattedCurrency,
};
