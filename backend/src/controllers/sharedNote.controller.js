import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import SharedNote from "../models/sharedNote.model.js";

const getSharedNote = asyncHandler(async (req, res) => {
  const link = req?.params?.link;

  const sharedNote = await SharedNote.findOne({ link }).populate("nid");
  if (!sharedNote) {
    throw new ApiError(404, "Shareable link not found");
  }

  res.status(200).send(new ApiResponse("Shearable link found", sharedNote));
});

const findSharedNote = asyncHandler(async (req, res) => {
  const id = req?.params?.noteId;

  const sharedNote = await SharedNote.findOne({ nid: id });
  if (!sharedNote) {
    throw new ApiError(404, "Shareable link not found");
  }

  res.status(200).send(new ApiResponse("Shearable link found", sharedNote));
});

const addSharedNote = asyncHandler(async (req, res) => {
  const uid = req?.user?.id;
  const { nid, link } = req.body;

  if ([uid, nid, link].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please provide the required details");
  }

  const sharedNote = await SharedNote.create({ uid, nid, link });
  if (!sharedNote) {
    throw new ApiError(500, "Error while creating shareable link");
  }

  res
    .status(201)
    .send(new ApiResponse("Shareable link created successfully", sharedNote));
});

export { getSharedNote, findSharedNote, addSharedNote };
