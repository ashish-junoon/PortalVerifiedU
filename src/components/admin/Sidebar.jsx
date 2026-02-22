import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiMenu } from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaServicestack } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Icon from "../utils/Icon"; // If you want custom icons

const menuItems = [
    { name: "Service Type", path: "/admin/service-type", icon: <FaServicestack size={20} /> },
    { name: "Service Master", path: "/admin/service-master", icon: <MdMiscellaneousServices size={20} /> },
    { name: "Users Master", path: "/admin/user-list", icon: <FiUsers size={20} /> },
    { name: "User Assign Service", path: "/admin/user-assign", icon: <FiHome size={20} /> },
];

export default function Sidebar({ children }) {
    const navigate = useNavigate();
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
            <div className="flex">
                <motion.div
                    initial={{ width: isOpen ? "250px" : "70px" }}
                    animate={{
                        width: isHovered || isOpen ? "250px" : "70px"
                    }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-0 top-[50px] min-h-[calc(100vh-50px)] bg-white shadow-lg p-4 overflow-y-auto"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >

                    {/* LOGO */}
                    <div className="flex items-center mb-6">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                            className="w-10 h-10 rounded-full"
                            alt="logo"
                        />
                        {(isHovered || isOpen) && (
                            <h2 className="ml-3 text-xl font-bold text-gray-700">Admin</h2>
                        )}
                    </div>

                    {/* MENU LIST */}
                    <div>
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className={`group flex items-center px-3 py-[10px] my-2 rounded-md cursor-pointer 
                                    ${activePath === item.path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-500 hover:text-white"}`}
                                onClick={() => {
                                    setActivePath(item.path);
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
                            className="group flex items-center px-3 py-[10px] my-4 rounded-md cursor-pointer text-red-600 hover:bg-red-500 hover:text-white"
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
                        isHovered || isOpen ? "ml-[250px]" : "ml-[70px]"
                    }`}
                >
                    {children}
                </motion.main>
            </div>
        </>
    );
}
