import express from "express";
import { createUser, getProfile } from "#root/modules/v1/auth/auth.controller.js";
import isAuthenticated from "#root/middlewares/authentication/isAuthenticated.middleware.js";
import loadUser from "#root/middlewares/authentication/loadUser.middleware.js";
import { authLimiter, limiter } from "#root/lib/utils/rateLimiters.js";

const router = express.Router();

router.post("/", isAuthenticated, createUser);
router.get("/me", limiter, isAuthenticated, loadUser(), getProfile);

export default router;
