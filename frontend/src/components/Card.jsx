import "../assets/styles/card.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { RiPushpinFill } from "react-icons/ri";

// store
import { CommonContext } from "../contexts/CommonContext";

// utils
import getFormattedTimestamp from ".././utils/formatTimestamp";

// components
import Loader from "../components/Loader";

const Card = ({ note }) => {
  const navigate = useNavigate();
  const { addPinnedNote, removePinnedNote } = useContext(CommonContext);
  const [isLoading, setIsLoading] = useState(false);

  const handlePin = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    if (note?.isPinned) {
      await removePinnedNote(note?._id);
    } else {
      await addPinnedNote({ uid: note?.uid, nid: note?._id });
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader />}
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
        <p className="card-timestamp">
          {getFormattedTimestamp(note?.updatedAt)}
        </p>
      </div>
    </>
  );
};

export default Card;
