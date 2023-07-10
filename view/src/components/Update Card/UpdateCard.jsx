import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSave } from "react-icons/lu";
import axios from "axios";
import { useFetch } from "../../custom hooks/useFetch";
import { ToggleContext } from "../../contexts/ToggleContext";

const UpdateCard = () => {
  const { updatingNote } = useContext(ToggleContext);
  const navigate = useNavigate();

  const { _id } = updatingNote;

  const [updatedNote, setUpdatedNote] = useState({
    title: updatingNote.title,
    desc: updatingNote.desc,
  });

  let tokenData = localStorage.getItem("token");

  useFetch(`${process.env.REACT_APP_API_LINK}/task`, tokenData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedNote((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleSaveNote = async (e) => {
    console.log("form data", updatedNote);

    try {
      let savedNoteData = await axios.put(
        `https://notes-app-0wxo.onrender.com/task/${_id}`,
        updatedNote,
        {
          headers: {
            Authorization: tokenData,
          },
        }
      );

      console.log("response from db", savedNoteData.data);

      const resData = savedNoteData.data.data;

      if (resData) {
        setUpdatedNote({
          title: "",
          desc: "",
        });
        navigate("/");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <section className="cards-main-bg">
      <h1>UPDATE TASK</h1>
      <div className="card-bg">
        <section className="card-title-div">
          <input
            type="text"
            className="card-input-title"
            name="title"
            placeholder="New Task"
            value={updatedNote.title}
            onChange={handleChange}
          />
        </section>

        <section className="card-content-div">
          <textarea
            className="card-input-content"
            name="desc"
            placeholder="write something..."
            maxLength={500}
            value={updatedNote.desc}
            onChange={handleChange}
          />
        </section>

        <section className="card-footer">
          <p className="char-rem-msg">100 character(s) remaining...</p>
          <div className="icons-div">
            <LuSave fontSize="20px" color="#00000" onClick={handleSaveNote} />
          </div>
        </section>
      </div>
      <button className="add-btn" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </section>
  );
};

export default UpdateCard;
