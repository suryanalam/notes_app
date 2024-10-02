import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useFetch } from "../composables/useFetch";
import { CommonContext } from "../contexts/CommonContext";

// Components
import Card from "../components/Card";
import NoCard from "../components/NoCard";
import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();

  const { notesData, msg, baseUrl } = useContext(CommonContext);
  const tokenData = localStorage.getItem("token");

  useFetch(`${baseUrl}/task`, tokenData);

  return (
    <>
      <Header />
      <section className="home-bg">
        <div className="add-btn-div">
          <button className="add-btn" onClick={() => navigate("/addTask")}>
            ADD
          </button>
        </div>
        {msg ? (
          <NoCard />
        ) : (
          <div className="tasks-bg">
            {notesData.map((note, index) => (
              <Card note={note} key={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
