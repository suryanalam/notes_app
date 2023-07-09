import "./CardModal.css";
import React, { useState, useContext } from "react";
import { LuSave } from "react-icons/lu";
import axios from "axios";
import { useFetch } from "../../custom hooks/useFetch";
import { ToggleContext } from "../../contexts/ToggleContext";

const CardModal = () => {



    const { updatingNote } = useContext(ToggleContext);

    const {_id,} = updatingNote;

    const [updatedNote, setUpdatedNote] = useState({
        title: updatingNote.title,
        desc: updatingNote.desc,
    });



    const { setShowCardModal } = useContext(ToggleContext);

    let tokenData = localStorage.getItem("token");

    useFetch('http://localhost:5000/task',tokenData);

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

        let savedNoteData = await axios.put(
        `http://localhost:5000/task/${_id}`,
        updatedNote,
        {
            headers: {
            Authorization: tokenData,
            },
        }
        );

        console.log("response from db", savedNoteData.data.data);

        if (savedNoteData.data.data) {
        setUpdatedNote({
            title: "",
            desc: "",
        });
        setShowCardModal(false);
        }
    };

  return (
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
  );
};

export default CardModal;
