import "../assets/styles/deleteDialog.css";
import { useContext } from "react";
import { useParams } from "react-router-dom";

// store
import { CommonContext } from "../contexts/CommonContext";

//components
import Dialog from "./Dialog";

const DeleteDialog = () => {
  const params = useParams();
  const { showDeleteDialog, setShowDeleteDialog, deleteNote } =
    useContext(CommonContext);

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
            onClick={() => setShowDeleteDialog(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-red dialog-btn"
            onClick={() => deleteNote(params?.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
