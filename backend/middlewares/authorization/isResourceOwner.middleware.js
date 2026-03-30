import createError from "#root/lib/utils/createError.js";

const isResourceOwner =
  ({reqKey = "resource"}) =>
  (req, _, next) => {
    const isResourceOwner = req.user.uid.toString() === req[reqKey].userId.toString();

    if (!isResourceOwner) return next(createError(`You are not the owner of this ${reqKey}`, 403));

    next();
  };

export default isResourceOwner;




