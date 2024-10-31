import "../assets/styles/card.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiPushpinFill } from "react-icons/ri";
import axios from "axios";

// store
import { CommonContext } from "../contexts/CommonContext";

const Card = ({ pinnedNote, note }) => {
  const navigate = useNavigate();

  const { baseUrl, options, fetchNotes, fetchPinnedNotes } =
    useContext(CommonContext);

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

  const addPinnedNote = async (url, payload, options) => {
    try {
      const resp = await axios.post(url, payload, options);
      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      }

      // call the GET api's to update the states synchronously !!
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const removePinnedNote = async (url, options) => {
    try {
      const resp = await axios.delete(url, options);
      if (resp.status !== 200) {
        throw new Error("something went wrong !!");
      }

      // call the GET api's to update the states synchronously !!
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // fetch api's based on the type of note (pinned | un-pinned)
  const handleClick = async (e) => {
    e.stopPropagation();

    if (isPinned) {
      removePinnedNote(
        `${baseUrl}/pinned_note/delete/${pinnedNoteId}`,
        options
      );
    } else {
      const payload = { uid: userId, nid: cardData?._id };
      addPinnedNote(`${baseUrl}/pinned_note/create`, payload, options);
    }
  };

  // update the card based on the type of note (pinned || un-pinned)
  useEffect(() => {
    if (pinnedNote) {
      setIsPinned(true);

      const { _id: pinnedNoteId, uid, nid: note } = pinnedNote;
      const { _id, title, content, createdAt, updatedAt } = note;

      setUserId(uid);
      setPinnedNoteId(pinnedNoteId);
      setCardData({
        _id,
        title,
        content,
        createdAt,
        updatedAt,
      });
    } else if (note) {
      const { _id, uid, title, content, createdAt, updatedAt } = note;

      setUserId(uid);
      setCardData({
        _id,
        title,
        content,
        createdAt,
        updatedAt,
      });
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
          onClick={(e) => handleClick(e)}
        />
      </div>
      <p className="card-content">{cardData?.content}</p>
      <p className="card-timestamp">{cardData?.updatedAt.split("T")[0]}</p>
    </div>
  );
};

export default Card;
