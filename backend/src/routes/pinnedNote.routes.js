import express from "express";
import {
  addPinnedNote,
  deletePinnedNote,
} from "../controllers/pinnedNote.controller.js";

const pinnedNoteRouter = express.Router();

pinnedNoteRouter.post("/", addPinnedNote);
pinnedNoteRouter.delete("/:id", deletePinnedNote);

export default pinnedNoteRouter;
