import admin from "firebase-admin";
import { db } from "#root/lib/firebase/config/firebaseAdmin.js";
import createError from "#root/lib/utils/createError.js";

// @POST: /banners/getBanners | middlewares: isAuthenticated
const getBanners = async (req, res, next) => {
  try {
    const bannersRef = db.collection("banners");
    const bannersSnap = await bannersRef.get();
    const bannersData = bannersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      success: true,
      message: "banners found successfully",
      data: bannersData,
    });
  } catch (err) {
    next(err);
  }
};

// @GET: /banners/getBanners/:id | middlewares:  loadResource
const getBanner = async (req, res, next) => {
  try {
    const banner = req.banner;

    res.status(200).json({
      success: true,
      message: "banner found successfully",
      data: banner,
    });
  } catch (err) {
    next(err);
  }
};

// @POST: /banners | middlewares: isAuthenticated, validate, loadUser
const createBanner = async (req, res, next) => {
  try {
    const user = req.user;
    const fields = req.filteredBody

    const bannersRef = db.collection("banners");
    const newBannerRef = bannersRef.doc(user.id);

    await newBannerRef.create( {
      ...fields,
      userId: user.id,
      author: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const createdBannerSnap = await bannersRef.doc(user.id).get();
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
    const fields = req.filteredBody

    const updatedBanner = {
      ...fields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await req.bannerRef.update(updatedBanner);

    const updatedBannerSnap = await req.bannerRef.get();
    const updatedBannerData = { id: updatedBannerSnap.id, ...updatedBannerSnap.data() };

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBannerData,
    });
  } catch (err) {
    next(err);
  }
};

export { getBanners, getBanner, createBanner, updateBanner };
