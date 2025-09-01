import "../assets/styles/shareDialog.css";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// icons
import { MdInfoOutline } from "react-icons/md";

// api
import { createSharedNote } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// utils
import generateHexCode from "../utils/generateHexCode";
import copyToClipboard from "../utils/copyToClipboard";

// components
import Dialog from "./Dialog";

const ShareDialog = () => {
  const params = useParams();
  const {
    apiInProgress,
    setApiInProgress,
    noteDetails,
    setNoteDetails,
    showShareDialog,
    setShowShareDialog,
  } = useContext(CommonContext);

  const inputRef = useRef();
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyLink = (link) => {
    setApiInProgress(true);
    setIsLinkCopied(true);
    inputRef.current.select();
    copyToClipboard(link);
    setTimeout(() => {
      inputRef.current.setSelectionRange(0, 0);
      setApiInProgress(false);
      setIsLinkCopied(false);
    }, 1000);
  };

  const handleGenerateLink = async () => {
    let hexCode = generateHexCode();
    const payload = {
      nid: params?.id,
      link: hexCode,
    };

    setApiInProgress(true);
    try {
      const data = await createSharedNote(payload);
      setNoteDetails({
        ...noteDetails,
        shareableLink: data?.link,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <Dialog
      showDialog={showShareDialog}
      dialogTitle="Share Note"
      disabled={apiInProgress}
      handleClose={() => setShowShareDialog(false)}
    >
      {noteDetails?.shareableLink ? (
        <div className="w-100 d-flex flex-col gap-4 flex-align-start flex-justify-center">
          <p className="share-text">
            The link to your note has been generated. Simply copy it from below
            to share!
          </p>
          <input
            ref={inputRef}
            type="text"
            className="link w-100"
            value={`http://localhost:3000/share/${noteDetails?.shareableLink}`}
            readOnly
          />
          <div className="d-flex flex-align-center gap-1 flex-wrap">
            <MdInfoOutline className="info-icon" />
            <span className="info-text">
              Link is accessible to <strong>everyone</strong> with{" "}
              <strong>read-only</strong> permissions.
            </span>
          </div>
          <button
            className="btn btn-primary w-100 dialog-btn d-flex gap-1 flex-align-center flex-justify-center"
            disabled={apiInProgress}
            onClick={() =>
              handleCopyLink(
                `http://localhost:3000/share/${noteDetails?.shareableLink}`
              )
            }
          >
            {isLinkCopied ? "Copied" : "Copy Link"}
          </button>
        </div>
      ) : (
        <div className="w-100 d-flex flex-col gap-4 flex-align-start flex-justify-center">
          <p className="share-text">
            You're just one step away from sharing your note with the world.
            Generate a shareable link now!
          </p>
          <input
            type="text"
            className="link w-100"
            value={`http://localhost:3000/share/...`}
            readOnly
          />
          <div className="d-flex flex-align-center gap-1 flex-wrap">
            <MdInfoOutline className="info-icon" />
            <span className="info-text">
              Link is accessible to <strong>everyone</strong> with{" "}
              <strong>read-only</strong> permissions.
            </span>
          </div>
          <button
            className="btn btn-primary w-100 dialog-btn d-flex gap-1 flex-align-center flex-justify-center"
            disabled={apiInProgress}
            onClick={handleGenerateLink}
          >
            Generate Link
          </button>
        </div>
      )}
    </Dialog>
  );
};

export default ShareDialog;
