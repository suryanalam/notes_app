import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import PinnedNote from "../models/pinnedNote.model.js";

const addPinnedNote = asyncHandler(async (req, res) => {
  const { nid, uid } = req.body;

  if (!nid || !uid) {
    throw new ApiError(400, "Invalid input");
  }

  const pinnedNote = await PinnedNote.create({ nid, uid });
  if (!pinnedNote) {
    throw new ApiError(500, "Error while creating pinned note");
  }

  res
    .status(201)
    .send(new ApiResponse("Pinned the note successfully", pinnedNote));
});

const getAllPinnedNotes = asyncHandler(async (req, res) => {
  const id = req?.user?.id;

  if (!id) {
    throw new ApiError(400, "Invalid input");
  }

  const pinnedNotes = await PinnedNote.find({ uid: id })
    .populate("nid")
    .sort({ createdAt: -1 });
  if (!pinnedNotes) {
    throw new ApiError(500, "Error while fetching pinned notes");
  }

  res
    .status(200)
    .send(new ApiResponse("Pinned notes found successfully", pinnedNotes));
});

const deletePinnedNote = async (req, res) => {
  const id = req?.params?.id;

  if (!id) {
    throw new ApiError(400, "Invalid input");
  }

  const pinnedNote = await PinnedNote.findByIdAndDelete(id);

  res
    .status(200)
    .send(new ApiResponse("Pinned note deleted successfully !!", pinnedNote));
};

export { addPinnedNote, getAllPinnedNotes, deletePinnedNote };
