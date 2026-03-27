import admin from "firebase-admin";
import { db } from "#root/lib/firebase/config/firebaseAdmin.js";

// @POST: /auth/createUser | middlewares: isAuthenticated
const createUser = async (req, res, next) => {
  try {
    const userRef = db.collection("users").doc(req.decoded.uid);
    const duplicate = await userRef.get();
    if (duplicate.exists) throw createError("DB User already exists", 409);

    const body = req.body;

    const createdUser = {
      uid: req.decoded.uid,
      email: req.decoded.email,
      photoURL: body.photoURL || "",
      displayName: body.displayName || "user_" + Math.random().toString(36).substring(2, 8),
      roles: ["user"],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(createdUser);

    const userSnap = await userRef.get();
    if (!userSnap.exists) throw createError("User not found", 404);

    const user = userSnap.data();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @GET: /auth/me | middlewares: isAuthenticated, loadUser
const getProfile = async (req, res, next) => {
  const me = req.user;

  try {
    res.status(200).json({
      success: true,
      message: "user found successfully",
      data: me,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createUser,
  getProfile
}