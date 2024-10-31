import "../assets/styles/note.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// icons
import { FiHome } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { RxShare1 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Loader from "../components/Loader";

const Note = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    setIsEditForm,
    setShowNoteForm,
    noteDetails,
    setNoteDetails,
    fetchNoteDetails,
  } = useContext(CommonContext);

  const { title, content } = noteDetails;

  const [loading, setLoading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleEditNote = () => {
    setShowNoteForm(true);
    setIsEditForm(true);
  };

  const handleShareNote = () => {};
  const handleDeleteNote = () => {};

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchNoteDetails(params?.id);
      setLoading(false);
    };

    console.log('prev: ', noteDetails?._id, 'new: ', params?.id);

    if(params?.id !== noteDetails?._id){
      console.log('fetch call...');
      setNoteDetails({
        _id: "",
        title: "",
        content: "",
        createdAt: "",
        updatedAt: "",
      });
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="note-container w-100">
          <div className="note-details-container">
            <h1 className="note-title">{title}</h1>
            <p className="note-content">{content}</p>
          </div>
        </div>
      )}

      <div className="menu-options-bg p-fixed w-100 d-flex flex-align-center flex-justify-center">
        <div className="menu-options-container w-100 d-flex flex-align-center flex-justify-around">
          <div
            className="menu-option cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FiHome />
          </div>
          <div className="menu-option cursor-pointer" onClick={copyToClipboard}>
            <LuCopy />
          </div>
          <div className="menu-option cursor-pointer" onClick={handleEditNote}>
            <FiEdit />
          </div>
          <div className="menu-option cursor-pointer" onClick={handleShareNote}>
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
    </>
  );
};

export default Note;
