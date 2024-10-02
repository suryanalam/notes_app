import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// icons
import { MdEdit, MdDelete } from "react-icons/md";

import { useFetch } from "../composables/useFetch";
import { CommonContext } from "../contexts/CommonContext";

const Card = ({ note }) => {
  const { _id, title, desc, createdAt, updatedAt } = note;

  const navigate = useNavigate();

  let { setUpdatingNote,confirmDelete, setConfirmDelete,baseUrl } = useContext(CommonContext);

  let tokenData = localStorage.getItem("token");

  useFetch(`${baseUrl}/task`, tokenData, confirmDelete);

  const handleEditNote = () => {
    setUpdatingNote({
      _id,
      title,
      desc,
    });
    navigate("/updateTask");
  };

  const handleDeleteNote = async () => {
    let confirmation = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmation) {
      navigate("/");
    }

    await axios
      .delete(`${baseUrl}/task/${_id}`, {
        headers: {
          Authorization: tokenData,
        },
      })
      .then((res) => {
        console.log("response from db of deleted item: ", res.data.data);
        setConfirmDelete(!confirmDelete);
      })
      .catch((err) => {
        console.log("error while deleting tasks in card.js: ", err);
      });
  };

  return (
    <div className="card-bg" key={_id}>
      <section className="card-title-div">
        <h3 className="title-text">{title}</h3>
      </section>

      <section className="card-content-div">
        <p className="card-content">{desc}</p>
      </section>

      <section className="card-footer" key={_id}>
        <p className="date-time">{updatedAt ? updatedAt : createdAt}</p>
        <div className="icons-div">
          <MdEdit fontSize="20px" color="#00000" onClick={handleEditNote} />
          <MdDelete fontSize="20px" color="#00000" onClick={handleDeleteNote} />
        </div>
      </section>
    </div>
  );
};

export default Card;
