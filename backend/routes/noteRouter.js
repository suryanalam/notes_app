import express from 'express';
import {
  addNote, getAllNotes, getNote, updateNote, deleteNote
} from "../controllers/note.controller.js";

// create a note router instance
const noteRouter = express.Router();

noteRouter.post("/create", addNote); // add task
noteRouter.get("/getAll", getAllNotes); // get all tasks
noteRouter.get("/get/:id", getNote); // get task by id
noteRouter.put("/update/:id", updateNote); // update task by id
noteRouter.delete("/delete/:id", deleteNote); // delete task by id

export default noteRouter;