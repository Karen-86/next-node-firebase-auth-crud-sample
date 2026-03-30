import express from "express";
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from "#root/modules/v1/blogs/blogs.controller.js";
import isAuthenticated from "#root/middlewares/authentication/isAuthenticated.middleware.js";
import loadUser from "#root/middlewares/authentication/loadUser.middleware.js";
import { limiter } from "#root/lib/utils/rateLimiters.js";
import validate from "#root/middlewares/validate.middleware.js";
import { createBlogSchema, updateBlogSchema } from "#root/modules/v1/blogs/blogs.validator.js";
import loadResource from "#root/middlewares/database/loadResource.middleware.js";
import isResourceOwner from "#root/middlewares/authorization/isResourceOwner.middleware.js";
import checkRoleHierarchy from "#root/middlewares/authorization/checkRoleHierarchy.middleware.js";
import createError from "#root/lib/utils/createError.js";

const router = express.Router();

router.get("/", getBlogs);

router.get("/:id", loadResource({ collectionName: "blogs", reqKey: "blog" }), getBlog);

router.post("/:id", isAuthenticated, validate(createBlogSchema), loadUser(), createBlog);

router.patch(
  "/:id",
  isAuthenticated,
  validate(updateBlogSchema),
  loadUser(),
  loadResource({ collectionName: "blogs", reqKey: "blog" }),
  isResourceOwner({ reqKey: "blog" }),
  updateBlog,
);

router.delete(
  "/:id",
  isAuthenticated,
  loadUser(),
  loadResource({ collectionName: "blogs", reqKey: "blog" }),
  loadResource({ collectionName: "users", reqKey: "foundUser", ignoreNotFound: true, getId: (req) => req.blog.userId }),
  checkRoleHierarchy({ ignoreTargetUserNotFound: true, allowOwner: true }),
  deleteBlog,
);

export default router;
