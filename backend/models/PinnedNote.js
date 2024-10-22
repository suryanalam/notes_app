import mongoose from "mongoose";

const pinnedNoteSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  },
  { timestamps: true }
);

const PinnedNote = mongoose.model(
  "PinnedNote",
  pinnedNoteSchema,
  "pinned_notes"
);

export default PinnedNote;
