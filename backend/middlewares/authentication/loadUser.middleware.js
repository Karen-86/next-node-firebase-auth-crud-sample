import { db } from "#root/lib/firebase/config/firebaseAdmin.js";
import createError from "#root/lib/utils/createError.js";

const loadUser = () => async (req, res, next) => {
  const userRef = db.collection("users").doc(req.decoded.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) return next(createError("Session expired or user no longer exists", 401));
  const userData = { id: userSnap.id, ...userSnap.data() };

  req.user = userData;
  req.userRef = userRef;
  req.userSnap = userSnap;

  next();
};

export default loadUser;
