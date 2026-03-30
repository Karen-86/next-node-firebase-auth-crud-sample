import admin from "firebase-admin";
import { db, adminAuth } from "#root/lib/firebase/config/firebaseAdmin.js";

// @GET: /users/getUsers | middlewares: isAuthenticated
const getUsers = async (req, res, next) => {
  try {
    const usersRef = db.collection("users").orderBy("createdAt", "desc");
    const usersSnap = await usersRef.get();

    const users = usersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      message: "users found successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @GET: /users/getUsers/:id | middlewares: isAuthenticated, loadResource
const getUser = async (req, res, next) => {
  try {
    const user = req.foundUser;

    res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @PATCH: /users/:id | middlewares:  isAuthenticated, validate, loadUser, loadResource, isOwner
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = {
      ...req.filteredBody,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await req.foundUserRef.update(updatedUser);

    const updatedUserSnap = await req.foundUserRef.get();
    const updatedUserData = updatedUserSnap.data();

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: updatedUserData,
    });
  } catch (err) {
    next(err);
  }
};

// @DELETE: /users/deleteUsers/:id | middlewares: isAuthenticated, loadUser, loadResource, checkRoleHierarchy
const deleteUser = async (req, res, next) => {
  try {
    const user = req.foundUser;

    // const userId = req.params.id
    // const bannerSnap = await bannersRef.get(userId)
    // const bannersSnap = await bannersRef.where("userId", "==", userId).get();

    // await Promise.all(bannersSnap.docs.map((doc) => doc.ref.delete()));

    const bannerRef = db.collection("banners").doc(user.id);
    await bannerRef.delete();

    await req.foundUserRef.delete();

    await adminAuth.deleteUser(req.foundUser.id);

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @PATCH: /users/:id/roles | middlewares:  isAuthenticated, validate, loadUser, checkRoleHierarchy
const updateUserRoles = async (req, res, next) => {
  try {
    const fields = req.filteredBody;
    // if (fields.roles.includes("superAdmin")) throw createError("Action forbidden: insufficient privileges.");
    const updatedUser = {
      ...fields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await req.foundUserRef.update(updatedUser);

    const updatedUserSnap = await req.foundUserRef.get();
    const updatedUserData = updatedUserSnap.data();

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: updatedUserData,
    });
  } catch (err) {
    next(err);
  }
};

export { getUsers, getUser, updateUser, deleteUser, updateUserRoles };
