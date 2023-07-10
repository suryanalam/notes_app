import "./AddCard.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSave } from "react-icons/lu";
import axios from "axios";
import { useFetch } from "../../custom hooks/useFetch";

const AddCard = () => {
  const navigate = useNavigate();

  let tokenData = localStorage.getItem("token");
  let payload;

  if (tokenData) {
    payload = JSON.parse(atob(tokenData.split(".")[1]));
  }

  useFetch(`https://notes-app-0wxo.onrender.com/task`, tokenData);

  const [note, setNote] = useState({
    uid: "",
    title: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleSaveNote = async (e) => {
    note.uid = payload.id;
    console.log("form data", note);

    try {
      let savedNoteData = await axios.post(
        `https://notes-app-0wxo.onrender.com/task`,
        note,
        {
          headers: {
            Authorization: tokenData,
          },
        }
      );
      console.log("response from db", savedNoteData);
      const resData = savedNoteData.data.data;

      if (resData) {
        setNote({
          uid: "",
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
      <h1>ADD TASK</h1>
      <div className="card-bg">
        <section className="card-title-div">
          <input
            type="text"
            className="card-input-title"
            name="title"
            placeholder="New Task"
            value={note.title}
            onChange={handleChange}
          />
        </section>

        <section className="card-content-div">
          <textarea
            className="card-input-content"
            name="desc"
            placeholder="write something..."
            maxLength={500}
            value={note.desc}
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

export default AddCard;
