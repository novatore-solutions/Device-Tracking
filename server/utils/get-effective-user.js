const _ = require('lodash');
const { isAdmin } = require('@base/utils/users');

const getEffectiveUserId = (req) => {
  const adminUser = req.user && isAdmin(req.user.roles);
  if (adminUser) return _.get(req.params, 'userId') || _.get(req.query, 'userId') || _.get(req.body, 'userId');
  return req.user._id.toString();
};

module.exports = getEffectiveUserId;
