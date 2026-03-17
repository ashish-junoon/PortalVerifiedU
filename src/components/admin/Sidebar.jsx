import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiMenu } from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaServicestack } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Icon from "../utils/Icon"; // If you want custom icons
import { TbFile } from "react-icons/tb";
import { GrServices } from "react-icons/gr";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <FiHome size={20} />,
  },
  {
    name: "User Assign Service",
    path: "/admin/user-assign",
    icon: <GrServices size={20} />,
  },
  {
    name: "Service Master",
    path: "/admin/service-master",
    icon: <MdMiscellaneousServices size={20} />,
  },
  {
    name: "Service Type",
    path: "/admin/service-type",
    icon: <FaServicestack size={20} />,
  },
  {
    name: "Users Master",
    path: "/admin/user-list",
    icon: <FiUsers size={20} />,
  },
  {
    name: "Reports",
    path: "/admin/service-report",
    icon: <TbFile size={20} />,
  },
];

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activePath, setActivePath] = useState("/admin");

  // Hover effects
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Logout function
  const handleLogout = () => {
    logout("admin");
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // first render par run
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* TOP NAVBAR STYLE BUTTON (Optional) */}
      <div className="w-full bg-white shadow-md py-3 px-4 flex items-center justify-between fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 text-2xl"
        >
          <FiMenu />
        </button>

        <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
      </div>

      {/* SIDEBAR */}
      <div className={`flex ${isOpen ? "md:block" : "hidden"}`}>
        <motion.div
          initial={{ width: isOpen ? "270px" : "0px" }}
          animate={{
            width: isHovered || isOpen ? "270px" : "0px",
          }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-[50px] min-h-[calc(100vh-50px)] bg-[#0b1120] shadow-lg p-4 overflow-y-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* LOGO */}
          <div className="flex items-center mb-6">
            {/* <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              className="w-9 h-9 rounded-full"
              alt="logo"
            /> */}
            {(isHovered || isOpen) && (
              <h2 className="ml-3 text-xl font-bold text-gray-100">Admin Panel</h2>
            )}
          </div>

          {/* <hr className="text-gray-700" /> */}

          {/* MENU LIST */}
          <div>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`group flex items-center px-3 py-[10px] my-2 rounded-md cursor-pointer 
                  ${location.pathname === item.path ? "bg-primary text-white" : "text-gray-300 hover:bg-primary hover:text-white"}`}
                onClick={() => {
                  // setActivePath(item.path);
                  navigate(item.path);
                }}
              >
                <div className="mr-4">{item.icon}</div>

                {(isHovered || isOpen) && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </div>
            ))}

            {/* LOGOUT */}
            <div
              className="group flex items-center px-3 py-[10px] my-4 rounded-md cursor-pointer text-amber-600 bg-amber-100/30 font-bold hover:bg-amber-500 hover:text-white"
              onClick={handleLogout}
            >
              <Icon name="RiLogoutBoxLine" size={20} />
              {(isHovered || isOpen) && (
                <span className="ml-3 text-sm font-medium">Sign Out</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <motion.main
          className={`mt-[60px] p-8 w-full transition-all duration-300 ${
            isHovered || isOpen ? "ml-[200px]" : "ml-[0px]"
          }`}
        >
          {children}
        </motion.main>
      </div>
    </>
  );
}
