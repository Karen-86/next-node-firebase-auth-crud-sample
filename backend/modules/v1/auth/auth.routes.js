import express from "express";
import { createUser, getProfile, updateEmail } from "#root/modules/v1/auth/auth.controller.js";
import isAuthenticated from "#root/middlewares/authentication/isAuthenticated.middleware.js";
import loadUser from "#root/middlewares/authentication/loadUser.middleware.js";
import { authLimiter, limiter } from "#root/lib/utils/rateLimiters.js";

const router = express.Router();

/* ---------- LIGHT LIMIT ---------- */
router.get("/me", limiter, isAuthenticated, loadUser(), getProfile);
router.patch("/email", limiter, isAuthenticated, loadUser(), updateEmail);

/* ---------- HEAVY LIMIT ---------- */
router.use(authLimiter);

router.post("/", isAuthenticated, createUser);

export default router;
