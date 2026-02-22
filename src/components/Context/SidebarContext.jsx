// SidebarContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);

  const toggleSidebar = () => setIsOpenSidebar((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpenSidebar(false);
      } else {
        setIsOpenSidebar(true);
      }
    };

    if (window.innerWidth < 1024) {
      setIsOpenSidebar(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpenSidebar(false);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ isOpenSidebar, toggleSidebar, closeOnMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
