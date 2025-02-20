import "../assets/styles/note.css";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// icons
import { FiHome } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { RxShare1 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";

// store
import { CommonContext } from "../contexts/CommonContext";

// helpers
import copyToClipboard from "../helpers/copyToClipboard";

// components
import Loader from "../components/Loader";
import ShareDialog from "../components/ShareDialog";
import DeleteDialog from "../components/DeleteDialog";
import Tooltip from "../components/Tooltip";

const Note = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    noteDetails,
    setIsEditForm,
    setShowNoteForm,
    setShowShareDialog,
    setShowDeleteDialog,
    fetchNoteDetails,
  } = useContext(CommonContext);

  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    copyToClipboard(noteDetails?.content);
    toast.success("Note copied successfully !!");
  };

  const handleEdit = () => {
    setIsEditForm(true);
    setShowNoteForm(true);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const resp = await fetchNoteDetails(params?.id);
      if (!resp) navigate("/");
      setLoading(false);
    };

    // trigger note details api only when the new note is viewed (cache the previous note data)
    params?.id !== noteDetails?.id && fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="note-container w-100">
        <h1 className="note-title">{noteDetails?.title}</h1>
        <p className="note-content">{noteDetails?.content}</p>
      </div>
      <div className="menu-options-bg p-fixed w-100 d-flex flex-align-center flex-justify-center">
        <div className="menu-options-container w-100 d-flex flex-align-center flex-justify-around">
          <div
            className="menu-option d-flex gap-2 flex-align-center cursor-pointer p-relative"
            onClick={() => navigate("/")}
          >
            <FiHome className="menu-icon" /> <p className="menu-text">Home</p>
            <Tooltip text={"Home"} />
          </div>
          <div
            className="menu-option d-flex gap-2 flex-align-center cursor-pointer p-relative"
            onClick={handleCopy}
          >
            <LuCopy className="menu-icon" /> <p className="menu-text">Copy</p>
            <Tooltip text={"Copy"} />
          </div>
          <div
            className="menu-option d-flex gap-2 flex-align-center cursor-pointer p-relative"
            onClick={handleEdit}
          >
            <FiEdit className="menu-icon" /> <p className="menu-text">Edit</p>
            <Tooltip text={"Edit"} />
          </div>
          <div
            className="menu-option d-flex gap-2 flex-align-center cursor-pointer p-relative"
            onClick={() => setShowShareDialog(true)}
          >
            <RxShare1 className="menu-icon" />{" "}
            <p className="menu-text">Share</p>
            <Tooltip text={"Share"} />
          </div>
          <div
            className="menu-option d-flex gap-2 flex-align-center cursor-pointer p-relative"
            onClick={() => setShowDeleteDialog(true)}
          >
            <FiTrash2 className="menu-icon" />{" "}
            <p className="menu-text">Delete</p>
            <Tooltip text={"Delete"} />
          </div>
        </div>
      </div>
      <ShareDialog />
      <DeleteDialog />
    </>
  );
};

export default Note;
