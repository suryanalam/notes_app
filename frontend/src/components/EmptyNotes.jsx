import "../assets/styles/emptyNotes.css";
import noData from "../assets/images/no-data.png";

const EmptyNotes = () => {
  return (
    <div className="empty-container d-flex flex-column flex-align-center flex-justify-center gap-4">
      <img src={noData} alt="notask-icon" className="no-task-img" draggable="false" />
      <h1 className="text-center">Notes not found! Start by adding one.</h1>
    </div>
  );
};

export default EmptyNotes;
