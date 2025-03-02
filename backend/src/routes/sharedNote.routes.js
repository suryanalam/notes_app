import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import {
  getSharedNote,
  findSharedNote,
  addSharedNote,
} from "../controllers/sharedNote.controller.js";

// create a note router instance
const sharedNoteRouter = express.Router();

sharedNoteRouter.get("/:link", getSharedNote);
sharedNoteRouter.get("/:noteId", authenticateUser, findSharedNote);
sharedNoteRouter.post("/", authenticateUser, addSharedNote);

export default sharedNoteRouter;
