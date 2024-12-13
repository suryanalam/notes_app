import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

// Store
import { CommonContext } from "../contexts/CommonContext";

const SharedNote = () => {
  const params = useParams();
  const { sharedNoteDetails, setSharedNoteDetails, fetchSharedNoteDetails } =
    useContext(CommonContext);

  const [loading, setLoading] = useState(false);
  const [isNoteExist, setIsNoteExist] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await fetchSharedNoteDetails(params?.link);
      
      if (!data) {
        setIsNoteExist(false);
        setLoading(false);
        return; 
      }

      setSharedNoteDetails(data);
      setIsNoteExist(true);
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header isGuest={true} />
      {loading ? (
        <Loader />
      ) : (
        <div className="note-container w-100">
          {isNoteExist ? (
            <div className="note-details-container">
              <h1 className="note-title">{sharedNoteDetails.title}</h1>
              <p className="note-content">{sharedNoteDetails.content}</p>
            </div>
          ) : (
            <div className="note-details-container">
              <p className="note-content">Invalid URL</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SharedNote;
