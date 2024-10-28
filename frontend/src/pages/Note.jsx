import "../assets/styles/note.css";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { RxShare1 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";

import { CommonContext } from "../contexts/CommonContext";

// components
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";

const Note = () => {
  const navigate = useNavigate();
  const { id: noteId } = useParams();

  const { noteDetails, fetchNoteDetails } = useContext(CommonContext);
  const { title, content } = noteDetails;

  const copyToClipboard = () => {};
  const handleEditNote = () => {};
  const handleShareNote = () => {};
  const handleDeleteNote = () => {};

  useEffect(() => {
    const fetch = async () => {
      await fetchNoteDetails(noteId);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="note-bg p-realtive w-100">
        {noteDetails && (
          <div className="note-details-container">
            <h1 className="note-title">{title}</h1>
            <p className="note-content">{content}</p>
          </div>
        )}

        <div className="menu-options-bg p-absolute w-100 d-flex flex-align-center flex-justify-center">
          <div className="menu-options-container w-100 d-flex flex-align-center flex-justify-around">
            <div
              className="menu-option cursor-pointer"
              onClick={() => navigate("/")}
            >
              <FiHome />
            </div>
            <div
              className="menu-option cursor-pointer"
              onClick={copyToClipboard}
            >
              <LuCopy />
            </div>
            <div
              className="menu-option cursor-pointer"
              onClick={handleEditNote}
            >
              <FiEdit />
            </div>
            <div
              className="menu-option cursor-pointer"
              onClick={handleShareNote}
            >
              <RxShare1 />
            </div>
            <div
              className="menu-option cursor-pointer"
              onClick={handleDeleteNote}
            >
              <FiTrash2 />
            </div>
          </div>
        </div>
      </div>
      <NoteForm />
    </>
  );
};

export default Note;
