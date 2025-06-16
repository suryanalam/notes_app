import "../assets/styles/dialog.css";
import { IoClose } from "react-icons/io5";

const Dialog = ({
  children,
  showDialog,
  dialogTitle,
  disabled,
  handleClose,
}) => {
  if (showDialog) {
    return (
      <div
        className={`dialog-bg p-fixed d-flex flex-align-center flex-justify-center ${
          disabled && "disabled-dialog"
        }`}
      >
        <div
          className="dialog-backdrop p-absolute w-100 h-100"
          onClick={handleClose}
        ></div>
        <div className="dialog-container">
          <div className="dialog-header d-flex flex-align-center flex-justify-between">
            <h1 className="dialog-title">{dialogTitle}</h1>
            <span className="dialog-close-div" onClick={handleClose}>
              <IoClose className="dialog-close-icon cursor-pointer" />
            </span>
          </div>
          {children}
        </div>
      </div>
    );
  }
};

export default Dialog;
