import SharedNote from "../models/SharedNote.js";

const addSharedNote = async (req, res) => {
  const { id: uid } = req.user;
  const { nid, link } = req.body;

  if (!uid || !nid || !link) {
    return res.status(400).send({
      message: "Invalid input data !!",
    });
  }

  try {
    const sharedNote = new SharedNote({ uid, nid, link });
    const newSharedNote = await sharedNote.save();

    res.status(201).send({
      message: "Created the link for the note successfully !!",
      data: newSharedNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while creating the link for the note !!",
    });
  }
};

const getSharedNote = async (req, res) => {
  const link = req.params.link;

  try {
    const sharedNoteData = await SharedNote.find({ link }).populate("nid");

    res.status(200).send({
      message: "Shared Note found successfully !!",
      data: sharedNoteData,
    });
  } catch {
    res.status(404).send({
      message: "Shared Note not found !!",
    });
  }
};

const findSharedNote = async (req, res) => {
  const nid = req.params.noteId;

  try {
    const sharedNoteData = await SharedNote.find({ nid });
    res.status(200).send({
      message: "Shared Note found successfully !!",
      data: sharedNoteData,
    });
  } catch {
    res.status(404).send({
      message: "Shared Note not found !!",
    });
  }
};

export { addSharedNote, getSharedNote, findSharedNote };
