import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";
import pinnedNoteRouter from "./routes/pinnedNote.routes.js";
import sharedNoteRouter from "./routes/sharedNote.routes.js";
import authenticateUser from "./middlewares/auth.middleware.js";
import ApiError from "./utils/ApiError.js";

// Config the dotenv library to track ENV variables
dotenv.config({
  path: "./.env",
});

// Create an express server instance
const app = express();
const corsOptions = {
  origin: [process.env.CORS_ORIGIN_PROD, process.env.CORS_ORIGIN_DEV],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

// Config Server Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Public API endpoints
app.use("/api/auth", authRouter);
app.use("/api/shared-note", sharedNoteRouter);

// Private API endpoints
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/note", authenticateUser, noteRouter);
app.use("/api/pinned-note", authenticateUser, pinnedNoteRouter);

// Centralized Error Handling Middleware
app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
    console.log('global err: ', err);
    // Handle custom API errors
    res.status(err.statusCode).send({
      success: err.success,
      message: err.message,
      data: err.data,
    });
  } else {
    // Handle generic errors
    res.status(500).send({
      success: false,
      message: err.message || "Internal server error",
      data: null,
    });
  }
});

export default app;
