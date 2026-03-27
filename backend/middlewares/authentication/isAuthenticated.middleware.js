import createError from "#root/lib/utils/createError.js";
import { adminAuth } from  "#root/lib/firebase/config/firebaseAdmin.js";

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(createError("Unauthorized", 401));

  req.decoded = await adminAuth.verifyIdToken(token);
  next();
};

export default isAuthenticated;
