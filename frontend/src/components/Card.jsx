import "../assets/styles/card.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { RiPushpinFill } from "react-icons/ri";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Loader from "../components/Loader";

const Card = ({ pinnedNote, note }) => {
  const navigate = useNavigate();
  const { addPinnedNote, removePinnedNote } = useContext(CommonContext);

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [pinnedNoteId, setPinnedNoteId] = useState(null);
  const [cardData, setCardData] = useState({
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  // handle api's based on the type of note (pinned | un-pinned)
  const handlePin = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    if (isPinned) {
      await removePinnedNote(pinnedNoteId);
    } else {
      const payload = { uid: userId, nid: cardData?.id };
      await addPinnedNote(payload);
    }
    setIsLoading(false);
  };

  // update the card based on the type of note (pinned || un-pinned)
  useEffect(() => {
    if (pinnedNote) {
      const { _id: pinnedNoteId, uid, nid: noteDetails } = pinnedNote;
      setUserId(uid);
      setIsPinned(true);
      setPinnedNoteId(pinnedNoteId);
      setCardData({ ...noteDetails, id: noteDetails._id });
    } else {
      const { uid, ...noteDetails } = note;
      setUserId(uid);
      setCardData({ ...noteDetails, id: noteDetails._id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div
        className="card-bg w-100 d-flex flex-column gap-2 cursor-pointer"
        onClick={() => navigate(`/note/${cardData?.id}`)}
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
    </>
  );
};

export default Card;
