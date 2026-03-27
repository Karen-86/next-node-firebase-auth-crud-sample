import express from "express";
// import dotenv from "dotenv";
// dotenv.config({ quiet: true });
import "dotenv/config";
import error from "#root/middlewares/system/error.middleware.js";
import notFound from "#root/middlewares/system/notFound.middleware.js";
import cors from "cors";
// import * as rateLimters from "#root/lib/utils/rateLimiters.js";
import authRouter from "#root/modules/v1/auth/auth.routes.js";
import usersRouter from "#root/modules/v1/users/users.routes.js";
import bannersRouter from "#root/modules/v1/banners/banners.routes.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({extended:true, limit: '2mb'}))
// app.use(cookieParser());
app.use("/public-route", express.static(join(__dirname, "public")));

// app.use("/api/v1/posts", rateLimters.limiter, postsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/banners", bannersRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(error);
app.use(notFound);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Running in ${process.env.NODE_ENV} mode`);
  console.log(`Server running on port ${PORT}`);
});
