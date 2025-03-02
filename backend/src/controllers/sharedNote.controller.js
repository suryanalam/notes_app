// Models
import SharedNote from "../models/sharedNote.model.js";

// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getSharedNote = asyncHandler(async (req, res) => {
  const link = req.params.link;

  const sharedNote = await SharedNote.findOne({ link }).populate("nid");
  if (!sharedNote) {
    throw new ApiError(404, "Shareable link not found !!");
  }

  res.status(200).send("Shared Note found successfully !!", sharedNote);
});

const findSharedNote = asyncHandler(async (req, res) => {
  const nid = req.params.noteId;

  const sharedNote = await SharedNote.findOne({ nid });
  if (!sharedNote) {
    throw new ApiError(404, "Shareable link not found !!");
  }

  res.status(200).send("Shared Note found successfully !!", sharedNote);
});

const addSharedNote = asyncHandler(async (req, res) => {
  const { id: uid } = req.user;
  const { nid, link } = req.body;

  if ([uid, nid, link].some((field) => field?.trim() === "")) {
    return new ApiError(400, "Please provide the required details !!");
  }

  const sharedNote = await SharedNote.create({ uid, nid, link });
  if (!sharedNote) {
    throw new ApiError(500, "Error while creating shareable link !!");
  }

  res
    .status(201)
    .send(
      new ApiResponse("Created the shareable link successfully !!", sharedNote)
    );
});

export { getSharedNote, findSharedNote, addSharedNote };
