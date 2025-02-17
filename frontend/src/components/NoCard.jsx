import noData from "../assets/images/no-data.png";

const NoCard = () => {
  return (
    <div className="no-data-div">
      <img src={noData} alt="notask-icon" className="no-task-img" />
      <h1>No Tasks Available</h1>
    </div>
  );
};

export default NoCard;
