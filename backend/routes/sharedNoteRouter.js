import express from "express";
import authorizeLogin from "../middlewares/authorizeLogin.js";
import {
  addSharedNote,
  getSharedNote,
  findSharedNote,
} from "../controllers/sharedNote.controller.js";

// create a note router instance
const sharedNoteRouter = express.Router();

sharedNoteRouter.get("/get/:link", getSharedNote);
sharedNoteRouter.post("/create", authorizeLogin, addSharedNote);
sharedNoteRouter.get("/find/:noteId", authorizeLogin, findSharedNote);

export default sharedNoteRouter;
