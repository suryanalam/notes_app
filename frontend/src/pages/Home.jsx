import "../assets/styles/home.css";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

import { CommonContext } from "../contexts/CommonContext";

// Components
import Header from "../components/Header";
import Card from "../components/Card";

const Home = () => {
  const navigate = useNavigate();

  const { notes, pinnedNotes, fetchNotes, fetchPinnedNotes } =
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
      <section className="home-bg w-100 d-flex flex-column gap-2">
        {pinnedNotes && (
          <div className="notes-cards-container w-100 d-grid grid-col-1 gap-3">
            {pinnedNotes.map((pinnedNote) => (
              <Card
                pinnedNote={pinnedNote}
                key={pinnedNote._id}
                isPinned={true}
              />
            ))}
          </div>
        )}

        {notes && (
          <div className="notes-cards-container w-100 d-grid grid-col-1 gap-3">
            {notes.map((note) => (
              <Card note={note} key={note._id} isPinned={false} />
            ))}
          </div>
        )}

        <div
          className="create-icon-div p-fixed d-flex flex-align-center flex-justify-center cursor-pointer"
          onClick={() => navigate("/addTask")}
        >
          <IoMdAdd className="create-icon" />
        </div>
      </section>
    </>
  );
};

export default Home;
