import "../assets/styles/sharedNote.css";
import brokenLink from "../assets/images/broken-link.png";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Store
import { CommonContext } from "../contexts/CommonContext";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

const SharedNote = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { sharedNoteDetails, getSharedNoteByLink } = useContext(CommonContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await getSharedNoteByLink(params?.link);
      setIsLoading(false);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      {sharedNoteDetails ? (
        <div className="shared-note-container w-100">
          <h1 className="shared-note-title">{sharedNoteDetails.title}</h1>
          <p className="shared-note-content">{sharedNoteDetails.content}</p>
        </div>
      ) : (
        <div className="shared-note-empty-container w-100 d-flex flex-column flex-align-center flex-justify-center gap-3">
          <img src={brokenLink} alt="broken link" draggable="false" className="shared-note-broken-link" />
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
