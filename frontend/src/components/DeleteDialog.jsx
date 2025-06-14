import "../assets/styles/deleteDialog.css";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// api
import { deleteNote } from "../services/noteService.js";

// store
import { CommonContext } from "../contexts/CommonContext";

//components
import Dialog from "./Dialog";

const DeleteDialog = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    apiInProgress,
    setApiInProgress,
    notes,
    setNotes,
    showDeleteDialog,
    setShowDeleteDialog,
  } = useContext(CommonContext);

  const handleDeleteNote = async (id) => {
    setApiInProgress(true);
    try {
      await deleteNote(id);
      const filteredNotes = notes?.filter((note) => note._id !== id);
      setNotes(filteredNotes);
      navigate("/");
      toast.success("Note deleted Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Dialog
      showDialog={showDeleteDialog}
      dialogTitle="Delete Note"
      handleClose={() => setShowDeleteDialog(false)}
    >
      <div className="d-flex flex-column gap-4 flex-align-start flex-justify-center">
        <p className="confirmation-text">
          Do you really want to delete the note? please confirm to proceed.
        </p>
        <div className="w-100 d-flex gap-2 flex-align-center flex-justify-end">
          <button
            className="btn btn-outline dialog-btn"
            disabled={apiInProgress}
            onClick={() => setShowDeleteDialog(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-red dialog-btn"
            disabled={apiInProgress}
            onClick={() => handleDeleteNote(params?.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
