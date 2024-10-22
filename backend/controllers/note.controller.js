import mongoose from "mongoose";
import Note from "../models/Note.js";

const addNote = async (req, res) => {
  const { uid, title, content } = req.body;

  if (!uid || !title || !content) {
    return res.status(400).send({
      message: "Invalid input data !!",
    });
  }

  const data = { uid, title, content };

  try {
    const note = new Note(data);
    const newNote = await note.save();

    res.status(201).send({
      message: "Note created successfully !!",
      data: newNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while adding a note !!",
    });
  }
};

const getAllNotes = async (req, res) => {
  let { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Invalid User Id !!",
    });
  }

  id = new mongoose.Types.ObjectId(id);

  try {
    const notesData = await Note.aggregate([
      {
        $match: {
          uid: id,
        },
      },
      {
        $lookup: {
          from: "pinned_notes",
          localField: "_id",
          foreignField: "nid",
          as: "pinnedNotes",
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $size: "$pinnedNotes",
              },
              0,
            ],
          },
        },
      },
      {
        $unset: "pinnedNotes",
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    res.status(200).send({
      message: "Notes found successfully !!",
      data: notesData,
    });
  } catch {
    res.status(404).send({
      message: "Notes not found !!",
    });
  }
};

const getNote = async (req, res) => {
  const id = req.params.id;

  try {
    const noteDetails = await Note.findOne({ _id: id });

    res.status(200).send({
      message: "Note found successfully !!",
      data: noteDetails,
    });
  } catch {
    return res.status(404).send({
      message: "Note not found !!",
    });
  }
};

const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(500).send({
      message: "please fill all the required fields !!",
    });
  }

  const data = { title, content };

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    res.status(200).send({
      message: "Note updated successfully !!",
      data: updatedNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while updating a note !!",
    });
  }
};

const deleteNote = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: id });

    res.status(200).send({
      message: "Note deleted successfully !!",
      data: deletedNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while deleting a note !!",
    });
  }
};

export { addNote, getAllNotes, getNote, updateNote, deleteNote };
