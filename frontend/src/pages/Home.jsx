import "../assets/styles/home.css";
import empty from "../assets/images/empty.png";
import { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";

// icons
import { IoMdAdd } from "react-icons/io";

// api
import { getAllNotes } from "../services/noteService";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Card from "../components/Card";

const Home = () => {
  const { notes, setNotes, setShowNoteForm } = useContext(CommonContext);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoader(true);
      try {
        const data = await getAllNotes();
        setNotes(data);
      } catch (error) {
        if (error?.response?.status === 401) return;
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoader(false);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loader) {
    return (
      <>
        <div className="notes-container w-100 d-grid grid-col-1 gap-2">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div className="skeleton-card" key={id}>
              <div className="title"></div>
              <div className="content"></div>
              <div className="timestamp"></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {notes?.length > 0 ? (
        <div className="notes-container w-100 d-grid grid-col-1 gap-2">
          {notes?.map((note) => (
            <Card note={note} key={note._id} />
          ))}
        </div>
      ) : (
        <div className="empty-container d-flex flex-col flex-align-center flex-justify-center gap-4">
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
