import "../assets/styles/tooltip.css";

// custom hooks
import useDevice from "../hooks/useDevice";

const Tooltip = ({ text }) => {
  const { device } = useDevice();

  if (device === "mobile") {
    return (
      <div className="tooltip-container p-absolute d-flex flex-align-center flex-justify-end cursor-pointer">
        <p className="text-center">{text}</p>
        <div className="tooltip-arrow p-absolute"></div>
      </div>
    );
  }
};

export default Tooltip;
