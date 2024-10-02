import express from 'express';
import {
  addNote, getAllNotes, getNote, updateNote, deleteNote
} from "../controllers/notes.controller.js";

// create a note router instance
const noteRouter = express.Router();

noteRouter.post("/", addNote); // add task
noteRouter.get("/", getAllNotes); // get all tasks
noteRouter.get("/:id", getNote); // get task by id
noteRouter.put("/:id", updateNote); // update task by id
noteRouter.delete("/:id", deleteNote); // delete task by id

export default noteRouter;