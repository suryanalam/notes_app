import express from "express";
import { getNote, updateNote } from "../controllers/note.controller.js";
import {
  addPinnedNote,
  getAllPinnedNotes,
  deletePinnedNote,
} from "../controllers/pinnedNote.controller.js";
// create a note router instance
const pinnedNoteRouter = express.Router();

pinnedNoteRouter.post("/create", addPinnedNote); // add task
pinnedNoteRouter.get("/getAll", getAllPinnedNotes); // get all tasks
pinnedNoteRouter.delete("/delete/:id", deletePinnedNote); // delete task by id

export default pinnedNoteRouter;
