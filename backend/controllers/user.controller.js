import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const signup = async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(500).send({
      message: "Please fill the required details !!",
    });
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(500).send({
      message: "User already exist !!",
    });
  }

  password = await bcrypt.hash(password, 10);
  if (!password) {
    return res.status(500).send({
      message: "Error while hashing the password !!",
    });
  }

  const newUser = { name, email, password };

  try {
    const user = new User(newUser);
    const userData = await user.save();
    res.status(201).send({
      message: "User created successfully !!",
      data: userData,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error while adding a User !!",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("please fill the required details !!");
  }

  const userData = await User.findOne({ email });
  if (!userData) {
    return res.status(401).send({
      message: "Invalid Email or Password !!",
    });
  }

  const isValid = await bcrypt.compare(password, userData.password);
  if (!isValid) {
    return res.status(401).send({
      message: "Invalid Email or Password !!",
    });
  }

  const token = jwt.sign(
    {
      id: userData._id,
      name: userData.name,
      email: userData.email,
    },
    process.env.JWT_SECRET_KEY
  );

  if (!token) {
    return res.status(500).send({
      message: "Token not generated !!",
    });
  }

  res.status(200).send({
    message: "User logged in successfully !!",
    token: token,
  });
};

const getAllUsers = async (_req, res) => {
  const userData = await User.find({});

  if (!userData.length) {
    return res.status(404).send({
      message: "Users not found !!",
    });
  }

  res.status(200).send({
    message: "Users found successfully !!",
    data: userData,
  });
};

const getUser = async (req, res) => {
  const id = req.params.id;

  const userData = await User.findOne({ _id: id });

  if (!userData) {
    return res.status(404).send({
      message: "User not found !!",
    });
  }

  res.status(200).send({
    message: "User found successfully !!",
    data: userData,
  });
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  const updatedUser = { name, email, password };

  let userData = await User.findOneAndUpdate(
    { _id: id },
    { $set: updatedUser },
    { new: true }
  );

  if (!userData) {
    return res.status(500).send({
      message: "Error while updating a User !!",
    });
  }

  res.status(200).send({
    message: "User updated successfully !!",
    data: userData,
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const userData = await User.findOneAndDelete({ _id: id });

  if (!userData) {
    return res.status(500).send({
      message: "Error while deleting a User !!",
    });
  }

  res.status(200).send({
    message: "User deleted successfully !!",
    data: userData,
  });
};

export { login, signup, getAllUsers, getUser, updateUser, deleteUser };
