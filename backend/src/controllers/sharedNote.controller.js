// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Models
import SharedNote from "../models/sharedNote.model.js";

const getSharedNoteByLink = asyncHandler(async (req, res) => {
  const link = req?.params?.link;

  if (!link) throw new ApiError(404, "Invalid link");

  const sharedNote = await SharedNote.findOne({ link }).populate("nid");
  if (!sharedNote) throw new ApiError(404, "Note not found");

  res.status(200).send(new ApiResponse("Note found", sharedNote));
});

const addSharedNote = asyncHandler(async (req, res) => {
  const uid = req?.user?.id;
  const { nid, link } = req.body;

  if (!uid) throw new ApiError(400, "Invalid user id");
  if (!nid) throw new ApiError(400, "Invalid note id");
  if (link?.trim() === "") throw new ApiError(400, "Please provide the link");

  const sharedNote = await SharedNote.create({ uid, nid, link });
  if (!sharedNote) {
    throw new ApiError(500, "Error while creating shareable link");
  }

  res
    .status(201)
    .send(new ApiResponse("Shareable link created successfully", sharedNote));
});

export { getSharedNoteByLink, addSharedNote };
