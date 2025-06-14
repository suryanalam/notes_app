import "../assets/styles/sharedNote.css";
import brokenLink from "../assets/images/broken-link.png";
import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// api
import { getSharedNoteByLink } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Header from "../components/Header";
import Loader from "../components/Loader";

const SharedNote = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    apiInProgress,
    setApiInProgress,
    sharedNoteDetails,
    setSharedNoteDetails,
  } = useContext(CommonContext);

  useEffect(() => {
    const fetch = async () => {
      setApiInProgress(true);
      try {
        const data = await getSharedNoteByLink(params?.link);
        setSharedNoteDetails(data);
      } catch (error) {
        if (error?.response?.status === 404) return;
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setApiInProgress(false);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {apiInProgress && <Loader />}
      <Header />
      {sharedNoteDetails ? (
        <div className="shared-note-container w-100">
          <h1 className="shared-note-title">{sharedNoteDetails.title}</h1>
          <p className="shared-note-content">{sharedNoteDetails.content}</p>
        </div>
      ) : (
        <div className="shared-note-empty-container w-100 d-flex flex-column flex-align-center flex-justify-center gap-3">
          <img
            src={brokenLink}
            alt="broken link"
            draggable="false"
            className="shared-note-broken-link"
          />
          <h1 className="text-center">Whoops! Link was broken.</h1>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Homepage
          </button>
        </div>
      )}
    </>
  );
};

export default SharedNote;
