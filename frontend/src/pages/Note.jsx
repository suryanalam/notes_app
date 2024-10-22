import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/note.css";

import { useFetch } from "../composables/useFetch";
import { CommonContext } from "../contexts/CommonContext";

// components
import Header from "../components/Header";

const Note = () => {
  const params = useParams();

  const token = localStorage.getItem("token");

  const { baseUrl, noteDetails, setNoteDetails } = useContext(CommonContext);

  const { data, error, loading } = useFetch(
    `${baseUrl}/note/get/${params.id}`,
    token
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setNoteDetails(data);
    }
  }, [data, setNoteDetails]);

  return (
    <>
      <Header />
      <section className="note-bg w-100">
        {loading && (
          <div className="w-100 h-100 d-flex flex-align-center flex-justify-center">
            <p>Loading...</p>
          </div>
        )}

        {error && <h1 className="text-red">{{ error }}</h1>}

        {noteDetails && (
          <div className="note-details-container">
            <h1 className="note-title">{noteDetails.title}</h1>
            <p className="note-content">{noteDetails.content}</p>
          </div>
        )}
      </section>
    </>
  );
};

export default Note;
