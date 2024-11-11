import "../assets/styles/note.css";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
import DeleteDialog from "../components/DeleteDialog";

const Note = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    noteDetails,
    setIsEditForm,
    setShowNoteForm,
    setShowDeleteDialog,
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

  const handleShare = () => {};

  const handleEdit = () => {
    setShowNoteForm(true);
    setIsEditForm(true);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchNoteDetails(params?.id);
      setLoading(false);
    };

    // fetch the api only when note details doesn't exist in the store.
    if (params?.id !== noteDetails?._id) {
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
          <div className="menu-option cursor-pointer" onClick={handleEdit}>
            <FiEdit />
          </div>
          <div className="menu-option cursor-pointer" onClick={handleShare}>
            <RxShare1 />
          </div>
          <div
            className="menu-option cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <FiTrash2 />
          </div>
        </div>
      </div>
      <DeleteDialog />
    </>
  );
};

export default Note;
