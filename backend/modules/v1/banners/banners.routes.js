import express from "express";
import { getBanners, createBanner, updateBanner } from "#root/modules/v1/banners/banners.controller.js";
import isAuthenticated from "#root/middlewares/authentication/isAuthenticated.middleware.js";
import loadUser from "#root/middlewares/authentication/loadUser.middleware.js";
import { limiter } from "#root/lib/utils/rateLimiters.js";
import validate from "#root/middlewares/validate.middleware.js";
import { createBannerSchema, updateBannerSchema } from "#root/modules/v1/banners/banners.validator.js";
import loadResource from "#root/middlewares/database/loadResource.middleware.js";
import isResourceOwner from "#root/middlewares/authorization/isResourceOwner.middleware.js";
import createError from "#root/lib/utils/createError.js";

const router = express.Router();

router.get("/", isAuthenticated, getBanners);

router.post("/", isAuthenticated, validate(createBannerSchema), loadUser(), createBanner);

router.patch(
  "/:id",
  isAuthenticated,
  validate(updateBannerSchema),
  loadUser(),
  loadResource({ collectionName: "banners", reqKey: "banner" }),
  isResourceOwner("banner"),
  updateBanner,
);

export default router;
