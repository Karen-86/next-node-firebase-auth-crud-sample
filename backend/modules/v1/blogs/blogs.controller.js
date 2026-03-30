import admin from "firebase-admin";
import { db } from "#root/lib/firebase/config/firebaseAdmin.js";
import createError from "#root/lib/utils/createError.js";

// @GET: /blogs/getBlogs | middlewares: -
const getBlogs = async (req, res, next) => {
  try {
    const { userId, limit, sort, order } = req.query;

    let blogsRef = db.collection("blogs");
    if (userId) blogsRef = blogsRef.where("userId", "==", userId);

    if (sort) {
      const safeOrder = order === "asc" ? "asc" : "desc"; // default desc
      blogsRef = blogsRef.orderBy(sort, safeOrder);
    }

    if (limit) {
      const safeLimit = Math.min(Number(limit), 50); // max 50
      blogsRef = blogsRef.limit(safeLimit);
    }

    const blogsSnap = await blogsRef.get();
    const blogsData = blogsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      success: true,
      message: "blogs found successfully",
      data: blogsData,
    });
  } catch (err) {
    next(err);
  }
};

// @GET: /blogs/getBlogs/:id | middlewares:  loadResource
const getBlog = async (req, res, next) => {
  try {
    const blog = req.blog;

    res.status(200).json({
      success: true,
      message: "blog found successfully",
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// @POST: /blogs/:id | middlewares: isAuthenticated, validate, loadUser
const createBlog = async (req, res, next) => {
  try {
    const user = req.user;
    const blogsRef = db.collection("blogs");

    const blogId = req.params.id;
    if (!blogId) throw createError("Invalid ID", 400);

    const { id } = await db.runTransaction(async (transaction) => {
      const query = blogsRef.where("userId", "==", user.id).limit(10);
      const snapshot = await transaction.get(query);

      if (snapshot.size >= 10) throw createError("Blog creation limit per user exceeded", 403);

      const newBlogRef = blogsRef.doc(blogId);
      const newBlogSnap = await transaction.get(newBlogRef);

      if (newBlogSnap.exists) throw createError("Blog with this ID already exists", 409);

      transaction.set(newBlogRef, {
        ...req.filteredBody,
        userId: user.id,
        author: req.user.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { id: newBlogRef.id };
    });

    const createdBlogSnap = await blogsRef.doc(id).get();
    const createdBlogData = { id: createdBlogSnap.id, ...createdBlogSnap.data() };

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: createdBlogData,
    });
  } catch (err) {
    next(err);
  }
};

// with auto generated ID
// const createBlog = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const blogsRef = db.collection("blogs");

//     // const blogId = req.params.id;
//     // if (!blogId) throw createError("Invalid ID", 400);

//     const { id } = await db.runTransaction(async (transaction) => {
//       const query = blogsRef.where("userId", "==", user.id).limit(10);
//       const snapshot = await transaction.get(query);

//       if (snapshot.size >= 10) throw createError("Blog creation limit per user exceeded", 403);

//       const newBlogRef = blogsRef.doc(); // no param = auto-ID
//       const newBlogSnap = await transaction.get(newBlogRef);

//       if (newBlogSnap.exists) throw createError("Blog with this ID already exists", 409);

//       transaction.set(newBlogRef, {
//         ...req.filteredBody,
//         userId: user.id,
//         author: req.user.email,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });

//       return { id: newBlogRef.id };
//     });

//     const createdBlogSnap = await blogsRef.doc(id).get();
//     const createdBlogData = { id: createdBlogSnap.id, ...createdBlogSnap.data() };

//     res.status(201).json({
//       success: true,
//       message: "Blog created successfully",
//       data: createdBlogData,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// @PATCH: /blogs/:id | middlewares: isAuthenticated, validate, loadUser, loadResource, isResourceOwner
const updateBlog = async (req, res, next) => {
  try {
    const fields = req.filteredBody;

    const updatedBlog = { ...fields, updatedAt: admin.firestore.FieldValue.serverTimestamp() };

    await req.blogRef.update(updatedBlog);

    const updatedBlogSnap = await req.blogRef.get();
    const updatedBlogData = { id: updatedBlogSnap.id, ...updatedBlogSnap.data() };

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlogData,
    });
  } catch (err) {
    next(err);
  }
};

// @DELETE: /blogs/:id | middlewares: isAuthenticated, loadUser, loadResource, isResourceOwner
const deleteBlog = async (req, res, next) => {
  try {
    await req.blogRef.delete();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: req.blog,
    });
  } catch (err) {
    next(err);
  }
};

export { getBlogs, getBlog, createBlog, updateBlog, deleteBlog };
