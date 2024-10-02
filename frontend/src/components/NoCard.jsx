import notaskImg from "../assets/images/no-task.jpg";

const NoCard = () => {
  return (
    <div className="no-data-div">
      <img src={notaskImg} alt="notask-icon" className="no-task-img" />
      <h1>No Tasks Available</h1>
    </div>
  );
};

export default NoCard;
