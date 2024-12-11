import {useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { CommonContext } from "../contexts/CommonContext";
import { useParams } from "react-router-dom";

const SharedNote = () => {

  const params = useParams();

  const {sharedNoteDetails, fetchSharedNoteDetails} = useContext(CommonContext);
  
  const { title, content } = sharedNoteDetails;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchSharedNoteDetails(params?.link);
      setLoading(false);
    };

    fetch();

    // fetch the api only when note details doesn't exist in the store.
    // if (params?.id !== sharedNoteDetails?._id) {
    //   setSharedNoteDetails({
    //     _id: "",
    //     title: "",
    //     content: "",
    //     createdAt: "",
    //     updatedAt: "",
    //   });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header isGuest={true} />
      {loading ? (
        <Loader />
      ) : (
        <div className="note-container w-100">
          <div className="note-details-container">
            <h1 className="note-title">{title}</h1>
            <p className="note-content">{content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SharedNote;
