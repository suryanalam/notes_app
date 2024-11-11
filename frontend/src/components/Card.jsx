import "../assets/styles/card.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { RiPushpinFill } from "react-icons/ri";

// store
import { CommonContext } from "../contexts/CommonContext";

const Card = ({ pinnedNote, note }) => {
  const navigate = useNavigate();

  const { addPinnedNote, removePinnedNote } = useContext(CommonContext);

  const [userId, setUserId] = useState(null);
  const [pinnedNoteId, setPinnedNoteId] = useState(null);

  const [isPinned, setIsPinned] = useState(false);
  const [cardData, setCardData] = useState({
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  // fetch api's based on the type of note (pinned | un-pinned)
  const handlePin = async (e) => {
    e.stopPropagation();

    if (isPinned) {
      removePinnedNote(pinnedNoteId);
    } else {
      const payload = { uid: userId, nid: cardData?._id };
      addPinnedNote(payload);
    }
  };

  // update the card based on the type of note (pinned || un-pinned)
  useEffect(() => {
    if (pinnedNote) {
      const { _id: pinnedNoteId, uid, nid: note } = pinnedNote;

      setUserId(uid);
      setPinnedNoteId(pinnedNoteId);

      setIsPinned(true);
      setCardData({ ...note });
    } else if (note) {
      const { uid, ...rem } = note;

      setUserId(uid);
      setCardData({ ...rem });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="card-bg w-100 d-flex flex-column gap-2 cursor-pointer"
      onClick={() => navigate(`/note/${cardData?._id}`)}
    >
      <div className="d-flex flex-align-center flex-justify-between">
        <h1 className="card-title">{cardData?.title}</h1>
        <RiPushpinFill
          className={`pin-icon ${isPinned && "pin-active"}`}
          onClick={(e) => handlePin(e)}
        />
      </div>
      <p className="card-content">{cardData?.content}</p>
      <p className="card-timestamp">{cardData?.updatedAt.split("T")[0]}</p>
    </div>
  );
};

export default Card;
