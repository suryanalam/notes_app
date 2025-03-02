import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String, 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
