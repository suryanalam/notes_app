import express from "express";
import {
  addPinnedNote,
  getAllPinnedNotes,
  deletePinnedNote,
} from "../controllers/pinnedNote.controller.js";

// create a note router instance
const pinnedNoteRouter = express.Router();

pinnedNoteRouter.post("/", addPinnedNote);
pinnedNoteRouter.get("/", getAllPinnedNotes);
pinnedNoteRouter.delete("/:id", deletePinnedNote);

export default pinnedNoteRouter;
