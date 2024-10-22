import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import userRouter from "./routes/userRouter.js";
import noteRouter from "./routes/noteRouter.js";
import pinnedNoteRouter from "./routes/pinnedNoteRouter.js";

// Middlewares
import authorizeLogin from "./middlewares/authorizeLogin.js";

// DB Connection
import dbConnection from "./dbConnection.js";

// Config the dotenv to track ENV variables
dotenv.config();

// Create an express instance
const app = express();

// Setup Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://jot-it-app.netlify.app"],
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trigger MongoDB Connection
dbConnection();

// Define all Api's related to the application
app.use('/api', userRouter);
app.use("/api/note", authorizeLogin, noteRouter);
app.use("/api/pinned_note", authorizeLogin, pinnedNoteRouter);

app.listen(process.env.PORT, () => {
  console.log("server started at port", process.env.PORT);
});
