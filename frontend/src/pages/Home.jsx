import "../assets/styles/home.css";
import empty from "../assets/images/empty.png";
import { useContext, useEffect, useState } from "react";

// icons
import { IoMdAdd } from "react-icons/io";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Card from "../components/Card";
import Loader from "../components/Loader";

const Home = () => {
  const { notes, fetchNotes, setShowNoteForm } = useContext(CommonContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await fetchNotes();
      setIsLoading(false);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {notes?.length > 0 ? (
        <div className="notes-container w-100 d-grid grid-col-1 gap-2">
          {notes?.map((note) => (
            <Card note={note} key={note._id} />
          ))}
        </div>
      ) : (
        <div className="empty-container d-flex flex-column flex-align-center flex-justify-center gap-4">
          <img
            src={empty}
            alt="empty notes"
            className="no-task-img"
            draggable="false"
          />
          <h1 className="text-center">Notes not found! Start by adding one.</h1>
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
