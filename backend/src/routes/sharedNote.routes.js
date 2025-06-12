import express from "express";
import {
  getSharedNoteByLink,
  getSharedNoteById,
  addSharedNote,
} from "../controllers/sharedNote.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const sharedNoteRouter = express.Router();

sharedNoteRouter.get("/:link", getSharedNoteByLink);
sharedNoteRouter.get("/find/:id", authenticateUser, getSharedNoteById);
sharedNoteRouter.post("/", authenticateUser, addSharedNote);

export default sharedNoteRouter;
