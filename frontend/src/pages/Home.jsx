import "../assets/styles/home.css";
import { useContext, useEffect, useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Card from "../components/Card";
import Loader from "../components/Loader";
import EmptyNotes from "../components/EmptyNotes";

const Home = () => {
  const { setShowNoteForm, notes, pinnedNotes, fetchNotes, fetchPinnedNotes } =
    useContext(CommonContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isNotesDataEmpty, setIsNotesDataEmpty] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await Promise.allSettled([fetchNotes(), fetchPinnedNotes()]);
      setIsLoading(false);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notes?.length || pinnedNotes?.length) {
      setIsNotesDataEmpty(false);
    } else {
      setIsNotesDataEmpty(true);
    }
  }, [notes, pinnedNotes]);

  return (
    <>
      {isLoading && <Loader />}
      {isNotesDataEmpty ? (
        <EmptyNotes />
      ) : (
        <div className="notes-container w-100 d-grid grid-col-1 gap-3">
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
