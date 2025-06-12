// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Models
import PinnedNote from "../models/pinnedNote.model.js";

const addPinnedNote = asyncHandler(async (req, res) => {
  const { uid, nid } = req.body;

  if (!uid) throw new ApiError(400, "Invalid user id");
  if (!nid) throw new ApiError(400, "Invalid note id");

  const pinnedNote = await PinnedNote.create({ nid, uid });
  if (!pinnedNote) throw new ApiError(500, "Error while creating pinned note");

  res
    .status(201)
    .send(new ApiResponse("Pinned the note successfully", pinnedNote));
});

const deletePinnedNote = asyncHandler(async (req, res) => {
  const nid = req?.params?.id;

  if (!nid) throw new ApiError(400, "Invalid note id");

  const pinnedNote = await PinnedNote.findOneAndDelete({ nid });
  if (!pinnedNote) throw new ApiError(500, "Error while deleting pinned note");

  res
    .status(200)
    .send(new ApiResponse("Pinned note deleted successfully !!", pinnedNote));
});

export { addPinnedNote, deletePinnedNote };
