import "../assets/styles/home.css";
import { useContext, useEffect, useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Card from "../components/Card";
import Loader from "../components/Loader";

const Home = () => {
  const { notes, pinnedNotes, fetchNotes, fetchPinnedNotes, setShowNoteForm } =
    useContext(CommonContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      if (!notes) {
        await fetchNotes();
      }
      if (!pinnedNotes) {
        await fetchPinnedNotes();
      }
      setLoading(false);
    }

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="notes-container w-100 d-grid grid-col-1 p gap-3">
          {pinnedNotes?.map((pinnedNote) => (
            <Card pinnedNote={pinnedNote} key={pinnedNote._id} />
          ))}
          {notes?.map((note) => (
            <Card note={note} key={note._id} />
          ))}
        </div>
      )}
      <div
        className="create-icon-div p-fixed d-flex flex-align-center flex-justify-center cursor-pointer"
        onClick={() => setShowNoteForm(true)}
      >
        <IoMdAdd className="create-icon" />
      </div>
    </>
  );
};

export default Home;
