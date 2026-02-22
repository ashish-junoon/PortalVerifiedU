import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FiHome,
    FiCreditCard,
    FiUserCheck,
    FiChevronDown,
    FiChevronRight,
    FiFileText,
    FiBriefcase,
} from "react-icons/fi";

import { AuthContext } from "./Context/AuthContext";
import { useSidebar } from "./Context/SidebarContext";
import Icon from "./utils/Icon";

const Sidebar = () => {
    const { servicesDetails } = useContext(AuthContext);
    const [openMenu, setOpenMenu] = useState(null);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const location = useLocation();
    const {closeOnMobile} = useSidebar()

    const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
    const toggleSubmenu = (submenu) => setOpenSubmenu(openSubmenu === submenu ? null : submenu);

    const isActive = (path) =>
        location.pathname === path ? "text-green-800 font-semibold" : "text-gray-600";

    const allowedServices =
        servicesDetails?.map(s => s.servicename.toLowerCase().trim()) || [];

    const hasService = (name) =>
        allowedServices.includes(name.toLowerCase().trim());

    return (
        <div className="w-64 top-16 bg-white border-r border-t border-gray-200 fixed shadow-sm z-50 max-md:w-full overflow-y-auto" style={{height: 'calc(100dvh - 4rem)'}}>
            {/* LOGO */}
            <div className="px-5 py-2 text-xl font-bold tracking-wide text-gray-800">
                Vendor Portal
            </div>

            <ul className="mt-0 space-y-0 px-2">

                {/* Dashboard */}
                <Link onClick={closeOnMobile} to="/">
                    <li
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer 
                        hover:bg-gray-100 transition ${isActive("/")}`}
                    >
                        <FiHome className="w-5" />
                        Dashboard
                    </li>
                </Link>
                {servicesDetails && servicesDetails.length !== 0 && (
                    <>

                
                {/* CREDIT MENU */}
                <li>
                    <div
                        onClick={() => toggleMenu("credit")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <FiCreditCard className="w-5" />
                            Credit Score
                        </div>
                        {openMenu === "credit" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "credit" && (
                        <ul className="ml-8 mt-0 space-y-1">

                            <Link onClick={closeOnMobile} to="/bureau/transunion">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("TransUnion") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/transunion")}`}
                                >
                                    TransUnion
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/bureau/experian">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("Experian") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/experian")}`}
                                >
                                    Experian
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/bureau/crif">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("CRIF") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/crif")}`}
                                >
                                    CRIF
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>

                {/* KYC MENU */}
                <li>
                    <div
                        onClick={() => toggleMenu("kyc")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <FiUserCheck className="w-5" />
                            KYC Services
                        </div>
                        {openMenu === "kyc" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "kyc" && (
                        <ul className="ml-8 mt-1 space-y-1">

                            {/* User Prefill */}
                            {/* <Link onClick={closeOnMobile} to="/bureau/user-prefill">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("User Prefill") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/user-prefill")}`}
                                >
                                    User Prefill
                                </li>
                            </Link> */}

                            {/* PAN submenu */}
                            <li>
                                <div
                                    onClick={() => toggleSubmenu("pan")}
                                    className="flex justify-between items-center cursor-pointer py-2 mr-8 text-gray-700 hover:text-blue-600"
                                >
                                    <span>PAN Services</span>
                                    {openSubmenu === "pan" ? <FiChevronDown /> : <FiChevronRight />}
                                </div>

                                {openSubmenu === "pan" && (
                                    <ul className="ml-3 mt-1 pl-3 border-l border-gray-300 space-y-1">

                                        {/* <Link onClick={closeOnMobile} to="/bureau/pan">
                                            <li
                                                className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                            ${hasService("PAN") ? "text-green-600" : "text-red-600"} 
                                            ${isActive("/bureau/pan")}`}
                                            >
                                                PAN to Mobile
                                            </li>
                                        </Link> */}

                                        <Link onClick={closeOnMobile} to="/bureau/pan-basic">
                                            <li
                                                className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                            ${hasService("Pan Basic") ? "text-green-600" : "text-red-600"} 
                                            ${isActive("/bureau/pan-basic")}`}
                                            >
                                                PAN Basic
                                            </li>
                                        </Link>

                                        {/* <Link onClick={closeOnMobile} to="/bureau/pancomp">
                                            <li
                                                className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                            ${hasService("PAN Comprehensive") ? "text-green-600" : "text-red-600"} 
                                            ${isActive("/bureau/pancomp")}`}
                                            >
                                                PAN Comprehensive
                                            </li>
                                        </Link> */}
                                    </ul>
                                )}
                            </li>

                            {/* Aadhaar submenu */}
                            {/* <li> */}
                                {/* <div
                                    onClick={() => toggleSubmenu("aadhaar")}
                                    className="flex justify-between items-center cursor-pointer py-2 text-gray-700 hover:text-blue-600"
                                >
                                    <span>Aadhaar Services</span>
                                    {openSubmenu === "aadhaar" ? "▲" : "▼"}
                                </div>

                                {openSubmenu === "aadhaar" && (
                                    <ul className="ml-3 mt-1 pl-3 border-l border-gray-300 space-y-1"> */}

                                        <Link onClick={closeOnMobile} to="/bureau/aadhar-verification">
                                            <li
                                                className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                                ${hasService("Aadhar Verification") ? "text-green-600" : "text-red-600"} 
                                                ${isActive("/bureau/aadhar-verification")}`}
                                            >
                                                Aadhaar Verification
                                            </li>
                                        </Link>

                                    {/* </ul>
                                )}
                            </li> */}

                            {/* Driving License */}
                            <Link onClick={closeOnMobile} to="/bureau/driving-license">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("Driving License") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/driving-license")}`}
                                >
                                    Driving License
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>

                {/* GST Menu */}
                <li>
                    <div
                        onClick={() => toggleMenu("gst")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <FiFileText className="w-5" />
                            GST Verify
                        </div>

                        {openMenu === "gst" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "gst" && (
                        <ul className="ml-8 mt-1 space-y-1">

                            <Link onClick={closeOnMobile} to="/bureau/gst">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("GST") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/gst")}`}
                                >
                                    GST Validation
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>

                {/* BANK Menu */}
                <li>
                    <div
                        onClick={() => toggleMenu("bank")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <FiBriefcase className="w-5" />
                            Bank Services
                        </div>
                        {openMenu === "bank" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "bank" && (
                        <ul className="ml-8 mt-1 space-y-1">

                            <Link onClick={closeOnMobile} to="/bureau/bank-account">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("Bank Account") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/bank-account")}`}
                                >
                                    Bank Account Verify
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/bureau/ifsc">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("IFSC") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/ifsc")}`}
                                >
                                    IFSC Verify
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/bureau/upi">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("UPI") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/bureau/upi")}`}
                                >
                                    UPI Verify
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>

                {/* ENACH Menu */}
                <li>
                    <div
                        onClick={() => toggleMenu("enach")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            {/* <FiBriefcase className="w-5" /> */}
                            <Icon name="CiBank" size={20} />
                            ENACH
                        </div>
                        {openMenu === "enach" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "enach" && (
                        <ul className="ml-8 mt-1 space-y-1">

                            <Link onClick={closeOnMobile} to="/enach/register">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("RegisterEMandate") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/enach/register")}`}
                                >
                                    Register ENach
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/enach/cancel-enach">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("cancelEMandate") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/enach/cancel-enach")}`}
                                >
                                    Cancel ENach
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/enach/pull-payment">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("PULL PAYMENT") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/enach/pull-payment")}`}
                                >
                                    Pull Payment
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>

                {/* PG Menu */}
                <li>
                    <div
                        onClick={() => toggleMenu("pg")}
                        className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            {/* <FiBriefcase className="w-5" /> */}
                            <Icon name="RiSecurePaymentFill" size={20} />
                            Payment
                        </div>
                        {openMenu === "pg" ? <FiChevronDown /> : <FiChevronRight />}
                    </div>

                    {openMenu === "pg" && (
                        <ul className="ml-8 mt-1 space-y-1">

                            {/* <Link onClick={closeOnMobile} to="/payment/payment-gateway">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("PAYMENT GATEWAY") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/payment/payment-gateway")}`}
                                >
                                    Payment Gateway
                                </li>
                            </Link> */}

                            <Link onClick={closeOnMobile} to="/payment/payment-link">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("createPaymentLink") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/payment/payment-link")}`}
                                >
                                    Payment Link
                                </li>
                            </Link>

                            <Link onClick={closeOnMobile} to="/payment/payment-qr">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("createPaymentQR") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/payment/payment-qr")}`}
                                >
                                    Payment QR
                                </li>
                            </Link>
                            
                            <Link onClick={closeOnMobile} to="/payment/quick-transfer">
                                <li
                                    className={`py-1 cursor-pointer hover:text-blue-600 transition 
                                    ${hasService("InitiateQuickTransfer") ? "text-green-600" : "text-red-600"} 
                                    ${isActive("/payment/quick-transfer")}`}
                                >
                                    Quick Transfer
                                </li>
                            </Link>

                        </ul>
                    )}
                </li>
                </>
)}
            </ul>
        </div>
    );
};

export default Sidebar;
