import "../assets/styles/bottomsheet.css";
import { IoClose } from "react-icons/io5";

const BottomSheet = ({
  children,
  showBottomSheet,
  bottomSheetTitle,
  disabled,
  handleClose,
}) => {
  if (showBottomSheet) {
    return (
      <div
        className={`bottomsheet-bg p-fixed ${
          disabled && "disabled-bottomsheet"
        }`}
      >
        <div
          className="bottomsheet-backdrop w-100 h-100"
          onClick={handleClose}
        />
        <div className="bottomsheet-container">
          <div className="bottomsheet-header d-flex flex-align-center flex-justify-between">
            <h1 className="bottomsheet-title">{bottomSheetTitle}</h1>
            <span className="bottomsheet-close-div" onClick={handleClose}>
              <IoClose className="bottomsheet-close-icon cursor-pointer" />
            </span>
          </div>
          {children}
        </div>
      </div>
    );
  }
};

export default BottomSheet;
