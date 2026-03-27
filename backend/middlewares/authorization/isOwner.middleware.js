import createError from "#root/lib/utils/createError.js";

const isOwner = async (req, _, next) => {
  const isOwner = req.user.uid.toString() === req.foundUser.uid.toString();

  if (!isOwner) return next(createError("You are not the owner", 403));

  next();
};

export default isOwner;
