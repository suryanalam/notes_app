import "../assets/styles/home.css";
import { useContext, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";

import { CommonContext } from "../contexts/CommonContext";

// Components
import Header from "../components/Header";
import Card from "../components/Card";
import NoteForm from "../components/NoteForm";

const Home = () => {
  const { notes, pinnedNotes, fetchNotes, fetchPinnedNotes, setShowNoteForm } =
    useContext(CommonContext);

  useEffect(() => {
    async function fetch() {
      await Promise.all([fetchNotes(), fetchPinnedNotes()]);
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="notes-container w-100 h-100 d-grid grid-col-1 p gap-3">
        {pinnedNotes &&
          pinnedNotes.map((pinnedNote) => (
            <Card
              pinnedNote={pinnedNote}
              key={pinnedNote._id}
              isPinned={true}
            />
          ))}
        {notes &&
          notes.map((note) => (
            <Card note={note} key={note._id} isPinned={false} />
          ))}
      </div>
      <div
        className="create-icon-div p-fixed d-flex flex-align-center flex-justify-center cursor-pointer"
        onClick={() => setShowNoteForm(true)}
      >
        <IoMdAdd className="create-icon" />
      </div>
      <NoteForm />
    </>
  );
};

export default Home;
