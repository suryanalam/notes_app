import "../assets/styles/deleteDialog.css";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// store
import { CommonContext } from "../contexts/CommonContext";
import Dialog from "./Dialog";

const DeleteDialog = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    baseUrl,
    options,
    showDeleteDialog,
    setShowDeleteDialog,
    fetchNotes,
    fetchPinnedNotes,
  } = useContext(CommonContext);

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleDeleteNote = async () => {
    try {
      await axios.delete(`${baseUrl}/note/delete/${params?.id}`, options);
      toast.success("Note deleted Successfully");
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
      navigate("/");
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error while deleting note");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <Dialog
      showDialog={showDeleteDialog}
      dialogTitle="Delete Note"
      handleClose={handleCloseDialog}
    >
      <div className="d-flex flex-column gap-4 flex-align-start flex-justify-center">
        <p className="confirmation-text">
          Do you really want to delete the note? please confirm to proceed.
        </p>
        <div className="w-100 d-flex gap-2 flex-align-center flex-justify-end">
          <button
            className="btn btn-outline dialog-btn"
            onClick={handleCloseDialog}
          >
            Cancel
          </button>
          <button className="btn btn-red dialog-btn" onClick={handleDeleteNote}>
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
