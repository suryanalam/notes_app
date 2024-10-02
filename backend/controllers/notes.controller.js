import mongoose from "mongoose";

import Note from '../models/Note.js'

const addNote = async (req, res) => {
  const { uid, title, content } = req.body;

  if (!title || !content || !uid) {
    return res.status(500).send({
      message: "please fill all the required fields !!",
    });
  }

  const newNote = { uid, title, content };

  const note = new Note(newNote);
  const noteData = await note.save();

  if (!noteData) {
    return res.status(500).send({
      message: "Error while adding a note !!",
    });
  }

  res.status(200).send({
    message: "note created successfully !!",
    data: noteData,
  });
};

const getAllNotes = async (req, res) => {
  const { id } = req.user;

  const notesData = await Note.find({ uid: id }).populate("uid", "name email");

  if (!notesData.length) {
    return res.status(404).send({
      message: "Notes not found !!",
    });
  }

  res.status(200).send({
    message: "Notes found successfully !!",
    data: notesData,
  });
};

const getNote = async (req, res) => {
  const id = req.params.id;

  const noteData = await Note.findOne({ _id: id }).populate("uid", "name email");

  if (!noteData) {
    return res.status(404).send({
      message: "Note not found !!",
    });
  }

  res.status(200).send({
    message: "Note found successfully !!",
    data: noteData,
  });
};

const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(500).send({
      message: "please fill all the required fields !!",
    });
  }

  const updatedNote = { title, content };

  const noteData = await Note.findOneAndUpdate(
    { _id: id },
    { $set: updatedNote },
    { new: true }
  );

  if (!noteData) {
    return res.status(500).send({
      message: "Error while updating a note !!",
    });
  }

  res.status(200).send({
    message: "note updated successfully !!",
    data: noteData,
  });
};

const deleteNote = async (req, res) => {
  const id = req.params.id;

  const noteData = await Note.findOneAndDelete({ _id: id });

  if (!noteData) {
    return res.status(500).send({
      message: "Error while deleting a note !!",
    });
  }

  res.status(200).send({
    message: "note deleted successfully !!",
    data: noteData,
  });
};

export { addNote, getAllNotes, getNote, updateNote, deleteNote };
