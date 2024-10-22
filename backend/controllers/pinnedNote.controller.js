import PinnedNote from "../models/PinnedNote.js";

const addPinnedNote = async (req, res) => {
  const { nid, uid } = req.body;

  if (!nid || !uid) {
    return res.status(400).send({
      message: "Invalid input data !!",
    });
  }

  try {
    const pinnedNote = new PinnedNote({ nid, uid });
    const newPinnedNote = await pinnedNote.save();

    res.status(201).send({
      message: "Pinned the note successfully !!",
      data: newPinnedNote,
    });
  } catch {
    res.status(500).send({
      message: "Error while adding a note !!",
    });
  }
};

const getAllPinnedNotes = async (req, res) => {
  const { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Invalid User Id !!",
    });
  }

  try {
    const pinnedNotesData = await PinnedNote.find({ uid: id })
      .populate("nid")
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "Pinned notes found successfully !!",
      data: pinnedNotesData,
    });
  } catch {
    res.status(404).send({
      message: "Pinned notes not found !!",
    });
  }
};

const deletePinnedNote = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPinnedNote = await PinnedNote.findOneAndDelete({
      _id: id,
    });

    res.status(200).send({
      message: "Pinned note deleted successfully !!",
      data: deletedPinnedNote,
    });
  } catch {
    return res.status(500).send({
      message: "Error while deleting the pinned note !!",
    });
  }
};

export { addPinnedNote, getAllPinnedNotes, deletePinnedNote };
