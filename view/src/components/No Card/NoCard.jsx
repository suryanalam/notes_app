import "../../pages/Home/Home.css";
import React from "react";

const NoCard = () => {
  return (
    <div className="no-data-div">
      <img
        src={process.env.PUBLIC_URL + "/assets/images/no-task.jpg"}
        alt="notask"
        className="no-task-img"
      />
      <h1>No Tasks Available</h1>
    </div>
  );
};

export default NoCard;
