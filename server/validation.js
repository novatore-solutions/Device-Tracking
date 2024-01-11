const Joi = require('@hapi/joi');

const validate = (data, schema, opts = {}) => {
  if (!opts) opts = {};
  const { error, value } = schema.validate(data, { abortEarly: true, convert: true, ...opts });

  if (error)
    return {
      error: error.details.map((detail) => detail.message),
      message: (error.message ?? '').replace(/"/g, ''),
      value,
    };

  return { error, value };
};

module.exports = {
  validate,
};
