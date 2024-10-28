import "../assets/styles/card.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiPushpinFill } from "react-icons/ri";
import axios from "axios";

import { CommonContext } from "../contexts/CommonContext";

const Card = ({ pinnedNote, note, isPinned }) => {
  const navigate = useNavigate();

  const { baseUrl, options, fetchNotes, fetchPinnedNotes } =
    useContext(CommonContext);

  const [userId, setUserId] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [pinnedNoteId, setPinnedNoteId] = useState(null);
  const [noteDetails, setNoteDetails] = useState({
    id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  // function to pin the note
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

  // function to un-pin the note
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

  // trigger the api functions based on the type of note (pinned | un-pinned)
  const handleClick = async (e) => {
    e.stopPropagation();

    if (isPinned) {
      removePinnedNote(
        `${baseUrl}/pinned_note/delete/${pinnedNoteId}`,
        options
      );
    } else {
      const payload = { uid: userId, nid: noteDetails.id };
      addPinnedNote(`${baseUrl}/pinned_note/create`, payload, options);
    }
  };

  // update local states based on the props data
  useEffect(() => {
    if (pinnedNote) {
      const { _id: pinnedNoteId, uid, nid: note } = pinnedNote;
      const { _id: id, title, content, createdAt, updatedAt } = note;

      setUserId(uid);
      setPinnedNoteId(pinnedNoteId);
      setNoteDetails({
        id,
        title,
        content,
        createdAt,
        updatedAt,
      });
    } else if (note) {
      const { _id: id, uid, title, content, createdAt, updatedAt } = note;

      setUserId(uid);
      setNoteDetails({
        id,
        title,
        content,
        createdAt,
        updatedAt,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // format the timestamp using createdAt or updatedAt;
  useEffect(() => {
    let date;

    if (noteDetails.updatedAt) {
      date = noteDetails.updatedAt.split("T")[0];
    } else {
      date = noteDetails.createdAt.split("T")[0];
    }

    setTimestamp(date);
  }, [noteDetails.createdAt, noteDetails.updatedAt]);

  return (
    <div
      className="card-bg w-100 d-flex flex-column gap-2 cursor-pointer"
      target="_blank"
      onClick={() => navigate(`/note/${noteDetails.id}`)}
    >
      <div className="d-flex flex-align-center flex-justify-between">
        <h1 className="card-title">{noteDetails.title}</h1>
        <RiPushpinFill
          className={`pin-icon ${isPinned && "pin-active"}`}
          onClick={(e) => handleClick(e)}
        />
      </div>
      <p className="card-content">{noteDetails.content}</p>
      <p className="card-timestamp">{timestamp}</p>
    </div>
  );
};

export default Card;
