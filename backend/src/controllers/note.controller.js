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

  if ([uid, title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const data = { uid, title, content };
  const note = await Note.create(data);
  if (!note) {
    throw new ApiError(500, "Error while creating note");
  }

  res.status(201).send(new ApiResponse("Note created successfully", note));
});

const getAllNotes = asyncHandler(async (req, res) => {
  let id = req?.user?.id;

  if (!id ||!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid input");
  }

  const notes = await Note.aggregate([
    {
      $match: {
        uid: new mongoose.Types.ObjectId(id),
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
      $match: {
        $expr: {
          $eq: [
            {
              $size: "$pinnedNotes",
            },
            0,
          ],
        },
      },
    },
    {
      $unset: "pinnedNotes",
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);
  if (!notes) {
    throw new ApiError(500, "Error while fetching notes");
  }

  res.status(200).send(new ApiResponse("Notes found successfully", notes));
});

const getNote = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (!id) {
    throw new ApiError(400, "Invalid input");
  }

  const note = await Note.findById(id);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.status(200).send(new ApiResponse("Note found successfully", note));
});

const updateNote = async (req, res) => {
  const id = req?.params?.id;

  if (!id) {
    throw new ApiError(400, "Invalid input");
  }

  const { title, content } = req.body;

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const data = { title, content };
  const note = await Note.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!note) {
    throw new ApiError(404, "Error while updating the note");
  }

  res.status(200).send(new ApiResponse("Note updated successfully", note));
};

const deleteNote = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (!id) {
    throw new ApiError(400, "Invalid input");
  }

  const note = await Note.findByIdAndDelete(id);
  await PinnedNote.findOneAndDelete({ nid: id });
  await SharedNote.findOneAndDelete({ nid: id });

  if(!note) {
    throw new ApiError(404, "Error while deleting the note");
  }

  res.status(200).send(new ApiResponse("Note deleted successfully", note));
});

export { addNote, getAllNotes, getNote, updateNote, deleteNote };
