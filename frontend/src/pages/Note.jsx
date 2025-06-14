import "../assets/styles/note.css";
import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// icons
import { FiHome } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { RxShare1 } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";

// api
import { getNoteDetails } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// utils
import copyToClipboard from "../utils/copyToClipboard";

// components
import Loader from "../components/Loader";
import ShareDialog from "../components/ShareDialog";
import DeleteDialog from "../components/DeleteDialog";
import Tooltip from "../components/Tooltip";

const Note = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    apiInProgress,
    setApInProgress,
    noteDetails,
    setNoteDetails,
    setIsEditForm,
    setShowNoteForm,
    setShowShareDialog,
    setShowDeleteDialog,
  } = useContext(CommonContext);

  const handleCopy = async () => {
    const isCopied = await copyToClipboard(noteDetails?.content);
    if (isCopied) {
      toast.success("Note copied successfully");
    } else {
      toast.error("Failed to copy note");
    }
  };

  const handleEdit = () => {
    setIsEditForm(true);
    setShowNoteForm(true);
  };

  useEffect(() => {
    // if note details are already fetched ignore api call
    if (params?.id === noteDetails?._id) return;
    const fetch = async () => {
      setApInProgress(true);
      try {
        const data = await getNoteDetails(params?.id);
        setNoteDetails(data);
      } catch (error) {
        if (error?.response?.status === 401) return;
        navigate("/");
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setApInProgress(false);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {apiInProgress && <Loader />}
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
