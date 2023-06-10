import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [windowSize, setWindowSize] = useState<number | undefined>();

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
