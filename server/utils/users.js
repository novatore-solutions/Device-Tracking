const { userRoles } = require('@base/constants/enums/userRoles');

const isAdminOnly = (roles) => !!roles?.includes(userRoles.Admin);
const isSuperAdmin = (roles) => !!roles?.includes(userRoles.SuperAdmin);
const isAdmin = (roles) => isAdminOnly(roles) || isSuperAdmin(roles);
const isEnterprise = (roles) => !!roles?.includes(userRoles.Enterprise);
const isK9 = (roles) => !!roles?.includes(userRoles.K9);

module.exports = {
  isAdmin,
  isAdminOnly,
  isSuperAdmin,
  isEnterprise,
  isK9,
};
