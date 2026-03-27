import createError from "../../lib/utils/createError.js";

const hierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
  superAdmin: 4,
};

const getHighestRoleLevel = (roles = [], roleHierarchy = {}) => {
  return roles.reduce((max, role) => Math.max(max, roleHierarchy[role] || 0), 0);
};

const checkRoleHierarchy =
  ({ allowOwner = false, roleHierarchy = hierarchy, ignoreTargetUserNotFound = false } = {}) =>
  (req, res, next) => {
    const actingUser = req.user;
    const targetUser = req.foundUser;

    if (!targetUser && ignoreTargetUserNotFound) {
      if (getHighestRoleLevel(actingUser.roles, roleHierarchy) > 1) return next();
      return next(createError("Forbidden: insufficient role level.", 403));
    }

    if (!actingUser || !targetUser) return next(createError("User(s) not found", 404));

    const actingLevel = getHighestRoleLevel(actingUser.roles, roleHierarchy);
    const targetLevel = getHighestRoleLevel(targetUser.roles, roleHierarchy);

    if (allowOwner && actingUser.uid.toString() === targetUser.uid.toString()) return next();

    if (actingLevel > targetLevel) return next();

    return next(createError("Action forbidden: insufficient role level.", 403));
  };

export default checkRoleHierarchy;
