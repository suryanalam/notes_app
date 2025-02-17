import "../assets/styles/loader.css";

const Loader = () => {
  return (
    <div className="loader-backdrop p-fixed w-100 h-100 d-flex flex-align-center flex-justify-center">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
