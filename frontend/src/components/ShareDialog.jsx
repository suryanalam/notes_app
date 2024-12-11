import "../assets/styles/shareDialog.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// icons
import { FaLink } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Dialog from "./Dialog";

// helpers
import generateHexCode from "../helpers/generateHexCode";

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
  const [btnText, setBtnText] = useState("Generate Link");
  const [isLinkGenerating, setIsLinkGenerating] = useState(false);

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

  const createSharedNote = async (payload) => {
    try {
      setIsLinkGenerating(true);
      const resp = await axios.post(
        `${baseUrl}/shared_note/create`,
        payload,
        options
      );

      if (resp.status !== 201) {
        throw new Error("something went wrong !!");
      }

      const link = resp.data.data?.link;
      setSharedNoteLink(`http://localhost:3000/share/${link}`);
      setIsLinkExist(true);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLinkGenerating(false);
    }
  };

  const handleClick = () => {
    if (isLinkExist) {
      copyToClipboard(sharedNoteLink);
    } else {
      // generate a 16 digit hexa-decimal code
      let hexDecCode = generateHexCode();
      const payload = {
        nid: params?.id,
        link: hexDecCode,
      };

      createSharedNote(payload);
    }
  };

  useEffect(() => {
    // check if the shareable link for the note has been generated or not
    const findSharedNote = async () => {
      try {
        const resp = await axios.get(
          `${baseUrl}/shared_note/find/${params?.id}`,
          options
        );

        if (resp.status !== 200) {
          throw new Error("Somethng went wrong !!");
        }

        // if link exist, set the states accordingly to update DOM
        let link = resp.data.data?.link;

        if (link) {
          link = `http://localhost:3000/share/${link}`;
          setSharedNoteLink(link);
          setIsLinkExist(true);
        } else {
          setSharedNoteLink("http://localhost:3000/share/...");
          setIsLinkExist(false);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    if (showShareDialog) {
      findSharedNote();
    }

    return () => {
      setSharedNoteLink("http://localhost:3000/share/...");
      setIsLinkExist(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShareDialog]);

  useEffect(() => {
    if (isLinkGenerating) {
      setBtnText("Generating...");
    } else if (isLinkExist) {
      setBtnText("Copy Link");
    } else {
      setBtnText("Generate Link");
    }

    return () => {
      setBtnText("Generate Link");
    };
  }, [isLinkExist, isLinkGenerating]);

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
          {btnText}
        </button>
      </div>
    </Dialog>
  );
};

export default ShareDialog;
