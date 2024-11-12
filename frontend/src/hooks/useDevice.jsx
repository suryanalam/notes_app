import { useEffect, useState } from "react";

const useDevice = () => {
  const [device, setDevice] = useState(
    window.innerWidth < 501 ? "mobile" : "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 501) {
        setDevice("mobile");
      } else {
        setDevice("desktop");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { device };
};

export default useDevice;
