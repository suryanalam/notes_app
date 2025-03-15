import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Config the dotenv to track ENV variables
dotenv.config({
  path: "./.env",
}); 

// Create an express server instance
const app = express();

// Config Server Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN_PROD, process.env.CORS_ORIGIN_DEV],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Routes
import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/note.routes.js";
import pinnedNoteRouter from "./routes/pinnedNote.routes.js";
import sharedNoteRouter from "./routes/sharedNote.routes.js";

// Middlewares
import authenticateUser from "./middlewares/auth.middleware.js";

// Utils
import ApiError from "./utils/ApiError.js";

// Define API endpoints
app.use("/api", userRouter);
app.use("/api/note", authenticateUser, noteRouter);
app.use("/api/pinned_note", authenticateUser, pinnedNoteRouter);
app.use("/api/shared_note", sharedNoteRouter);

// Centralized Error Handling Middleware
app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
      // Handle custom API errors
      res.status(err.statusCode).json({
          success: err.success,
          message: err.message,
          data: err.data,
      });
  } else {
      // Handle generic errors
      res.status(500).json({
          success: false,
          message: err.message || "Internal server error",
          data: null
      });
  }
});

export default app;
