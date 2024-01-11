class CustomError extends Error {
  constructor(opts) {
    super();

    Error.captureStackTrace(this, this.constructor);

    opts || (opts = {});

    if (typeof opts === 'string') {
      this.message = opts;
      return;
    }

    for (const key in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, key)) {
        this[key] = opts[key];
      }
    }
  }
}

function _parseFloat(value, fallback = 0.0) {
  try {
    return parseFloat(value);
  } catch (error) {
    // Do nothing
  }

  return fallback;
}

function _parseInt(value, fallback = 0.0) {
  try {
    return parseInt(value);
  } catch (error) {
    // Do nothing
  }

  return fallback;
}

function pagination(page, limit, total) {
  const result = {};

  result.total = total;
  result.totalPages = Math.ceil(total / limit);
  result.next = page + 1;
  result.hasNext = result.next <= result.total;
  result.prev = page - 1;
  result.hasPrev = result.prev !== 0;
  result.perPage = limit;
  result.current = page;

  return result;
}

function filterObject(obj, compareFn) {
  const result = {};

  if (typeof compareFn === 'undefined') {
    compareFn = (value) => typeof value !== 'undefined';
  } else if (typeof compareFn === 'string') {
    compareFn = (value) => typeof value === 'string' && value;
  } else if (compareFn === null) {
    compareFn = (value) => value !== null;
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (compareFn(value)) {
      result[key] = value;
    }
  });

  return result;
}

function unpackQuery(req) {
  const sort = req.query.sort || '_id';
  const sortOrder = _parseInt(req.query.sortOrder, -1) === -1 ? -1 : 1;
  const perPage = _parseInt(req.query.perPage) || 20;
  const page = _parseInt(req.query.page) || 1;
  const filter = req.query.filter;

  return {
    sort,
    sortOrder,
    perPage,
    page,
    filter,
  };
}

function arrayToDict(arr, key) {
  return arr.reduce((acc, item) => {
    const itemKey = item[key].toString ? item[key].toString() : item[key];
    acc[itemKey] = item;
    return acc;
  }, {});
}

module.exports = exports = {
  CustomError,

  parseInt: _parseInt,
  parseFloat: _parseFloat,

  pagination,
  filterObject,
  unpackQuery,
  arrayToDict,
};
