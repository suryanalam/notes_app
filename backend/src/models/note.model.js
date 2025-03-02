import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
