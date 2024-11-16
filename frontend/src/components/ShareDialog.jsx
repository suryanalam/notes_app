import "../assets/styles/shareDialog.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

// icons
import { FaLink } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";

// store
import { CommonContext } from "../contexts/CommonContext";
import Dialog from "./Dialog";
import { useParams } from "react-router-dom";

const ShareDialog = () => {
  const params = useParams();
  const {
    baseUrl,
    options,
    showShareDialog,
    setShowShareDialog,
    sharedNoteLink,
    setSharedNoteLink,
  } = useContext(CommonContext);

  const [isLinkExist, setIsLinkExist] = useState(false);

  const handleCloseDialog = () => {
    setShowShareDialog(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const createSharedNote = async(payload) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/shared_note/create`,
        payload,
        options
      );
      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  const handleClick = () => {
    if (isLinkExist) {
      copyToClipboard(sharedNoteLink);
    } else {
      // generate a 16 digit hexa-decimal code
      let hexDecCode;
      const payload = {
        nid: params?.id,
        link: hexDecCode,
      }
      createSharedNote(payload);
    }
  };

  useEffect(() => {
    const id = params?.id;

    // check if the shareable link for the note has been generated or not 
    const findSharedNote = async (id) => {
      try {
        const resp = await axios.get(
          `${baseUrl}/shared_note/find/${id}`,
          options
        );

        if (resp.status !== 200 || !resp?.data?.data) {
          throw new Error("Somethng went wrong !!");
        }

        return resp.data.data;
      } catch (err) {
        console.log("Error:", err);
        return null;
      }
    };

    const resp = findSharedNote(id);

    // if link exist, set the states accordingly to update DOM
    if (resp !== null) {
      let link = resp.data.data?.link;
      link = `https://localhost:5000/share/${link}`;
      setSharedNoteLink(link);
      setIsLinkExist(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      showDialog={showShareDialog}
      dialogTitle="Share Note"
      handleClose={handleCloseDialog}
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
          {isLinkExist ? "Copy Link" : "Generate Link"}
        </button>
      </div>
    </Dialog>
  );
};

export default ShareDialog;
