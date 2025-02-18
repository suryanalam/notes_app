import "../assets/styles/shareDialog.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// icons
import { FaLink } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";

// store
import { CommonContext } from "../contexts/CommonContext";

// helpers
import generateHexCode from "../helpers/generateHexCode";
import copyToClipboard from "../helpers/copyToClipboard";

// components
import Dialog from "./Dialog";

const ShareDialog = () => {
  const params = useParams();
  const {
    showShareDialog,
    setShowShareDialog,
    sharedNoteLink,
    setSharedNoteLink,
    findSharedNote,
    createSharedNote,
  } = useContext(CommonContext);

  const [btnText, setBtnText] = useState("Generate Link");
  const [isLinkExist, setIsLinkExist] = useState(false);
  const [isLinkGenerating, setIsLinkGenerating] = useState(false);

  const handleClick = async () => {
    if (isLinkExist) {
      copyToClipboard(sharedNoteLink);
      setBtnText('Copied');
      return;
    }

    let hexCode = generateHexCode();
    const payload = {
      nid: params?.id,
      link: hexCode,
    };
    setIsLinkGenerating(true);
    const resp = await createSharedNote(payload);
    if (resp) setIsLinkExist(true);
    setIsLinkGenerating(false);
  };

  // check if the shareable link has been generated or not
  useEffect(() => {
    const findNote = async () => {
      const resp = await findSharedNote(params?.id);
      if (resp) setIsLinkExist(true);
    };

    // trigger this api only when share dialog is opened
    if(showShareDialog) findNote();

    // cleanup function
    return () => {
      setIsLinkExist(false);
      setIsLinkGenerating(false);
      setBtnText('Generate Link');
      setSharedNoteLink("http://localhost:3000/share/...");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShareDialog]);

  // update the button based on the toggling states
  useEffect(() => {
    if (isLinkGenerating) {
      setBtnText("Generating...");
    } else if (isLinkExist) {
      setBtnText("Copy Link");
    } else {
      setBtnText("Generate Link");
    }
  }, [isLinkExist, isLinkGenerating]);

  return (
    <Dialog
      showDialog={showShareDialog}
      dialogTitle="Share Note"
      handleClose={() => setShowShareDialog(false)}
    >
      <div className="w-100 d-flex flex-column gap-4 flex-align-start flex-justify-center">
        <p className="share-text">
          {isLinkExist
            ? "The link to your note has been generated. Simply copy it from below to share!"
            : "You're just one step away from sharing your note with the world. Generate a shareable link now!"}
        </p>
        <div className="link-div w-100">
          <h6 className="link">{sharedNoteLink}</h6>
        </div>

        <div className="d-flex flex-align-center gap-1 flex-wrap">
          <MdInfoOutline className="info-icon" />
          <span className="info-text">
            Link is accessible to <strong>everyone</strong> with{" "}
            <strong>read-only</strong> permissions.
          </span>
        </div>

        <button
          className="btn btn-primary w-100 dialog-btn d-flex gap-1 flex-align-center flex-justify-center"
          onClick={handleClick}
        >
          <FaLink className="link-icon" />
          {btnText}
        </button>
      </div>
    </Dialog>
  );
};

export default ShareDialog;
