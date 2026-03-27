import express from "express";
import { getUsers, getUser, deleteUser } from "#root/modules/v1/users/users.controller.js";
import isAuthenticated from "#root/middlewares/authentication/isAuthenticated.middleware.js";
import loadUser from "#root/middlewares/authentication/loadUser.middleware.js";
import loadResource from "#root/middlewares/database/loadResource.middleware.js";
import checkRoleHierarchy from "#root/middlewares/authorization/checkRoleHierarchy.middleware.js";
import { limiter } from "#root/lib/utils/rateLimiters.js";
import { updateUserSchema } from '#root/modules/v1/users/users.validator.js'
import isOwner from "#root/middlewares/authorization/isOwner.middleware.js";
import { updateUser } from "#root/modules/v1/users/users.controller.js";
import validate from '#root/middlewares/validate.middleware.js'

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getUsers);

router.get("/:id", loadResource({ collectionName: 'users',  reqKey: "foundUser" }), getUser); // allowed for all authenticated users

router.patch(
  "/:id",
  validate(updateUserSchema),
  loadUser(),
  loadResource({ collectionName: 'users', reqKey: "foundUser" }),
  isOwner,
  updateUser,
);

router.delete(
  "/:id",
  loadUser(),
  loadResource({ collectionName: 'users', reqKey: "foundUser" }),
  checkRoleHierarchy({ allowOwner: true }),
  deleteUser,
);


export default router;
