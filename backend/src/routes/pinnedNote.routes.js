import express from "express";
import {
  addPinnedNote,
  getAllPinnedNotes,
  deletePinnedNote,
} from "../controllers/pinnedNote.controller.js";

const pinnedNoteRouter = express.Router();

pinnedNoteRouter.post("/", addPinnedNote);
pinnedNoteRouter.get("/", getAllPinnedNotes);
pinnedNoteRouter.delete("/:id", deletePinnedNote);

export default pinnedNoteRouter;
