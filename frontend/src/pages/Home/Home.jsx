import "./Home.css";

import React,{ useContext} from "react";
import { useNavigate } from "react-router-dom";

//components
import Card from "../../components/Card/Card";
import NoCard from "../../components/No Card/NoCard";
import Header from "../../components/Header/Header";

//Hooks
import {useFetch} from "..//..//custom hooks/useFetch";
import { ToggleContext } from './../../contexts/ToggleContext';


const Home = () => {

  const navigate = useNavigate();

  const {notesData, msg,baseUrl} = useContext(ToggleContext); 
  const tokenData = localStorage.getItem("token");

  useFetch(`${baseUrl}/task`,tokenData);

  return (
    <>
      <Header />
      <section className="home-bg">
        <div className="add-btn-div">
          <button className='add-btn' onClick={()=>navigate('/addTask')}>ADD</button>
        </div>
          {     
            msg ? <NoCard />
                :
                <div className="tasks-bg">
                { 
                  notesData.map((note,index)=><Card note = {note} key={index}/>)
                }
                </div>
          }
    
      </section>
    </>
  );
};

export default Home;
