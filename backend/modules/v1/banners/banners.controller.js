import admin from "firebase-admin";
import { db } from "#root/lib/firebase/config/firebaseAdmin.js";
import createError from "#root/lib/utils/createError.js";

// @POST: /banners/getBanners | middlewares: isAuthenticated
const getBanners = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    let bannersRef = db.collection("banners");
    if (userId) bannersRef = bannersRef.where("userId", "==", userId);
    // bannersRef = bannersRef.orderBy("createdAt", "desc");

    const bannersSnap = await bannersRef.get();
    const bannersData = bannersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      message: "banners found successfully",
      data: bannersData,
    });
  } catch (err) {
    next(err);
  }
};

// @POST: /banners | middlewares: isAuthenticated, validate, loadUser
const createBanner = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const bannersRef = db.collection("banners");

    const { id } = await db.runTransaction(async (transaction) => {
      const query = bannersRef.where("userId", "==", userId).limit(1);
      const snapshot = await transaction.get(query);

      if (!snapshot.empty) throw createError("Banner already exists", 409);

      const newBannerRef = bannersRef.doc(); // auto-ID

      transaction.set(newBannerRef, {
        ...req.filteredBody,
        userId,
        author: req.user.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { id: newBannerRef.id };
    });

    const createdBannerSnap = await bannersRef.doc(id).get();
    const createdBannerData = { id: createdBannerSnap.id, ...createdBannerSnap.data() };

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: createdBannerData,
    });
  } catch (err) {
    next(err);
  }
};

// @PATCH: /banners/:id | middlewares: isAuthenticated, validate, loadUser, loadResource, isResourceOwner
const updateBanner = async (req, res, next) => {
  try {
    const updatedBanner = {
      ...req.filteredBody,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await req.bannerRef.update(updatedBanner);

    const updatedBannerSnap = await req.bannerRef.get();
    const updatedBannerData = { id: updatedBannerSnap.id, ...updatedBannerSnap.data() };

    res.status(201).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBannerData,
    });
  } catch (err) {
    next(err);
  }
};

export { getBanners, createBanner, updateBanner };
