import "../assets/styles/shareDialog.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// icons
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
    disableBtn,
    setDisableBtn,
    showShareDialog,
    setShowShareDialog,
    sharedNoteLink,
    setSharedNoteLink,
    findSharedNote,
    createSharedNote,
  } = useContext(CommonContext);

  const text = useRef();
  const [btnText, setBtnText] = useState("Generate Link");
  const [isLinkExist, setIsLinkExist] = useState(false);

  const handleClick = async () => {
    if (isLinkExist) {
      copyToClipboard(sharedNoteLink);
      setDisableBtn(true);
      setBtnText("Copied");
      text.current.select();
      setTimeout(() => {
        window.getSelection().removeAllRanges();
        setDisableBtn(false);
        setBtnText("Copy Link");
      }, 2000);
      return;
    }

    let hexCode = generateHexCode();
    const payload = {
      nid: params?.id,
      link: hexCode,
    };

    setBtnText("Generating...");
    const link = await createSharedNote(payload);
    if (link) {
      setSharedNoteLink(`http://localhost:3000/share/${link}`);
      setBtnText("Copy Link");
      setIsLinkExist(true);
    } else {
      setSharedNoteLink("http://localhost:3000/share/...");
      setBtnText("Generate Link");
      setIsLinkExist(false);
    }
  };

  // check the shareable link is exist or not
  useEffect(() => {
    const findNote = async () => {
      const link = await findSharedNote(params?.id);
      if (link) {
        setSharedNoteLink(`http://localhost:3000/share/${link}`);
        setBtnText("Copy Link");
        setIsLinkExist(true);
      } else {
        setSharedNoteLink("http://localhost:3000/share/...");
        setBtnText("Generate Link");
        setIsLinkExist(false);
      }
    };

    // if link is already generated then don't trigger findSharedNote api
    if (showShareDialog && sharedNoteLink) {
      // if link exist then update the states based on the link
      if (sharedNoteLink === "http://localhost:3000/share/...") {
        setBtnText("Generate Link");
        setIsLinkExist(false);
      } else {
        setBtnText("Copy Link");
        setIsLinkExist(true);
      }
    } else if (showShareDialog && !sharedNoteLink) {
      findNote();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShareDialog]);

  // reset state values only when note page unmounts (cleanup function)
  useEffect(() => {
    return () => {
      setIsLinkExist(false);
      setSharedNoteLink("");
      setBtnText("Generate Link");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      showDialog={showShareDialog}
      dialogTitle="Share Note"
      handleClose={() => setShowShareDialog(false)}
    >
      {!sharedNoteLink ? (
        <div className="skeleton-share-div d-flex flex-column gap-4 flex-align-start flex-justify-center">
          <div className="skeleton-title-div w-100"></div>
          <div className="skeleton-link-div w-100"></div>
          <div className="skeleton-caption-div w-100"></div>
          <div className="skeleton-button-div w-100"></div>
        </div>
      ) : (
        <div className="w-100 d-flex flex-column gap-4 flex-align-start flex-justify-center">
          <p className="share-text">
            {isLinkExist
              ? "The link to your note has been generated. Simply copy it from below to share!"
              : "You're just one step away from sharing your note with the world. Generate a shareable link now!"}
          </p>
          <input
            type="text"
            ref={text}
            className="link w-100"
            value={sharedNoteLink}
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
            disabled={disableBtn}
            onClick={handleClick}
          >
            {btnText}
          </button>
        </div>
      )}
    </Dialog>
  );
};

export default ShareDialog;
