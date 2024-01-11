const { userRoles } = require('@base/constants/enums/userRoles');

const isAdminOnly = (roles) => !!roles?.includes(userRoles.Admin);
const isSuperAdmin = (roles) => !!roles?.includes(userRoles.SuperAdmin);
const isAdmin = (roles) => isAdminOnly(roles) || isSuperAdmin(roles);

module.exports = {
  isAdmin,
  isSuperAdmin,
};
