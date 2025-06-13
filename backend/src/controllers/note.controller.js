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
      $lookup: {
        from: "shared_notes",
        localField: "_id",
        foreignField: "nid",
        as: "sharedNotes",
      },
    },
    {
      $unwind: {
        path: "$sharedNotes",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        shareableLink: "$sharedNotes.link",
      },
    },
    {
      $unset: "sharedNotes",
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

  const note = await Note.findById(id).lean();
  if (!note) throw new ApiError(404, "Note not found");

  const pinnedNote = await PinnedNote.findOne({ nid: id });
  if (pinnedNote) {
    note.isPinned = true;
  } else {
    note.isPinned = false;
  }

  const sharedNote = await SharedNote.findOne({ nid: id });
  if (sharedNote) {
    note.shareableLink = sharedNote?.link;
  } else {
    note.shareableLink = null;
  }

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
  await PinnedNote.findOneAndDelete({ nid: id });
  await SharedNote.findOneAndDelete({ nid: id });

  if (!note) throw new ApiError(404, "Error while deleting the note");

  res.status(200).send(new ApiResponse("Note deleted successfully", note));
});

export { addNote, getAllNotes, getNote, updateNote, deleteNote };
