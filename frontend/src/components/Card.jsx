import "../assets/styles/card.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// icons
import { RiPushpinFill } from "react-icons/ri";

// api
import { addPinnedNote, removePinnedNote } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// utils
import getFormattedTimestamp from ".././utils/formatTimestamp";

const Card = ({ note }) => {
  const navigate = useNavigate();
  const { notes, setNotes } = useContext(CommonContext);

  const handleAddPinnedNote = async (payload) => {
    try {
      await addPinnedNote(payload);
      const filteredNotes = notes?.map((item) => {
        if (item?._id === note?._id) item.isPinned = true;
        return item;
      });
      setNotes(filteredNotes);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemovePinnedNote = async (id) => {
    try {
      await removePinnedNote(id);
      const filteredNotes = notes?.map((item) => {
        if (item?._id === note?._id) item.isPinned = false;
        return item;
      });
      setNotes(filteredNotes);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation();

    if (note?.isPinned) {
      handleRemovePinnedNote(note?._id);
    } else {
      handleAddPinnedNote({ uid: note?.uid, nid: note?._id });
    }
  };

  return (
    <div
      className="card-bg w-100 d-flex flex-column gap-2 cursor-pointer"
      onClick={() => navigate(`/note/${note?._id}`)}
    >
      <div className="d-flex flex-align-center flex-justify-between">
        <h1 className="card-title">{note?.title}</h1>
        <RiPushpinFill
          className={`pin-icon ${note?.isPinned && "pin-active"}`}
          onClick={(e) => handlePin(e)}
        />
      </div>
      <p className="card-content">{note?.content}</p>
      <p className="card-timestamp">{getFormattedTimestamp(note?.updatedAt)}</p>
    </div>
  );
};

export default Card;
