import express from "express";
import {
  addNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const noteRouter = express.Router();

noteRouter.post("/", addNote);
noteRouter.get("/", getAllNotes);
noteRouter.get("/:id", getNote);
noteRouter.put("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;
