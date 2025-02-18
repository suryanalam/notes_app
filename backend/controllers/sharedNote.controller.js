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

    if(!newSharedNote) throw new Error('Something went wrong !!');

    res.status(201).send({
      message: "Created the shareable link successfully !!",
      data: newSharedNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while creating the shareable link !!",
    });
  }
};

const getSharedNote = async (req, res) => {
  const link = req.params.link;

  try {
    const sharedNoteData = await SharedNote.findOne({ link }).populate("nid");

    if(!sharedNoteData){
      return res.status(404).send({
        message: "Shared Note not found !!",
      });
    }

    res.status(200).send({
      message: "Shared Note found successfully !!",
      data: sharedNoteData,
    });
  } catch {
    res.status(500).send({
      message: "Error while finding shared note !!",
    });
  }
};

const findSharedNote = async (req, res) => {
  const nid = req.params.noteId;

  try {
    const sharedNoteData = await SharedNote.findOne({ nid });

    if(!sharedNoteData){
      return res.status(404).send({
        message: "Shared Note not found !!",
      });
    }

    res.status(200).send({
      message: "Shared Note found successfully !!",
      data: sharedNoteData,
    });
  } catch {
    res.status(500).send({
      message: "Error while finding shared note !!",
    });
  }
};

export { addSharedNote, getSharedNote, findSharedNote };
