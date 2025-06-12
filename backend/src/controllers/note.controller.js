import mongoose from "mongoose";

// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Models
import Note from "../models/note.model.js";
import PinnedNote from "../models/pinnedNote.model.js";
import SharedNote from "../models/sharedNote.model.js";

const addNote = asyncHandler(async (req, res) => {
  const uid = req?.user?.id;
  const { title, content } = req.body;

  if (!uid) throw new ApiError(400, "Invalid user id");
  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const note = await Note.create({ uid, title, content });
  if (!note) throw new ApiError(500, "Error while creating the note");

  res.status(201).send(new ApiResponse("Note created successfully", note));
});

const getAllNotes = asyncHandler(async (req, res) => {
  const uid = req?.user?.id;

  if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
    throw new ApiError(400, "Invalid user id");
  }

  const notes = await Note.aggregate([
    {
      $match: {
        uid: new mongoose.Types.ObjectId(uid),
      },
    },
    {
      $lookup: {
        from: "pinned_notes",
        localField: "_id",
        foreignField: "nid",
        as: "pinnedNotes",
      },
    },
    {
      $addFields: {
        isPinned: {
          $gt: [{ $size: "$pinnedNotes" }, 0],
        },
      },
    },
    {
      $unset: "pinnedNotes",
    },
    {
      $sort: {
        isPinned: -1,
        updatedAt: -1,
      },
    },
  ]);
  if (!notes) throw new ApiError(500, "Error while fetching notes");

  res.status(200).send(new ApiResponse("Notes found successfully", notes));
});

const getNote = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (!id) throw new ApiError(400, "Invalid note id");

  const note = await Note.findById(id);
  if (!note) throw new ApiError(404, "Note not found");

  res.status(200).send(new ApiResponse("Note found successfully", note));
});

const updateNote = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  const { title, content } = req.body;

  if (!id) throw new ApiError(400, "Invalid note id");
  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const note = await Note.findByIdAndUpdate(
    id,
    { $set: { title, content } },
    { new: true }
  );
  if (!note) throw new ApiError(404, "Error while updating the note");

  res.status(200).send(new ApiResponse("Note updated successfully", note));
});

const deleteNote = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (!id) throw new ApiError(400, "Invalid note id");

  const note = await Note.findByIdAndDelete(id);
  const pinnedNote = await PinnedNote.findOneAndDelete({ nid: id });
  const sharedNote = await SharedNote.findOneAndDelete({ nid: id });

  if (!note || !pinnedNote || !sharedNote) {
    throw new ApiError(404, "Error while deleting the note");
  }

  res.status(200).send(new ApiResponse("Note deleted successfully", note));
});

export { addNote, getAllNotes, getNote, updateNote, deleteNote };
