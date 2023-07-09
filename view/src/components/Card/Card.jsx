import "./Card.css";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";

import { useFetch } from "../../custom hooks/useFetch";
import { ToggleContext } from "../../contexts/ToggleContext";

const Card = ({note}) => {

  // console.log("card data in card.js: ", note);
  const { _id, title, desc, createdAt, updatedAt } = note;

  const navigate = useNavigate();

  let { setUpdatingNote } = 
  useContext(ToggleContext);

  let tokenData = localStorage.getItem("token");
  
  const handleEditNote = () => {
    setUpdatingNote({
      _id, 
      title,
      desc,
    });
    navigate('/updateTask')
  };

  const handleDeleteNote = async () => {
    
    await axios.delete(`https://notes-app-0wxo.onrender.com/task/${_id}`,{
        headers: {
          Authorization: tokenData,
        },
    })
      .then((res)=>{
        console.log("response from db of deleted item: ", res.data.data);
        window.location.reload();
      })
      .catch((err)=>{
        console.log('error while deleting tasks in card.js: ',err);
      })

  };

  useFetch(`https://notes-app-0wxo.onrender.com/task`, tokenData);

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
