import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, "is invalid"],
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
