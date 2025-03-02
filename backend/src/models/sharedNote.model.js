import mongoose from "mongoose";

const sharedNoteSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    link: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const SharedNote = mongoose.model(
  "SharedNote",
  sharedNoteSchema,
  "shared_notes"
);

export default SharedNote;
