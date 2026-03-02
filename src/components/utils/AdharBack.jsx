import React from "react";
import Images from "../content/Images";
import {
    FiHome,
    FiCreditCard,
    FiUserCheck,
    FiChevronDown,
    FiChevronRight,
    FiFileText,
    FiBriefcase,
} from "react-icons/fi";
import { TbMail, TbPhone, TbWorld } from "react-icons/tb";

const AdharBack = ({
    name,
    dob,
    gender,
    aadhaarNumber,
    images,
    address
}) => {
    return (
        <div className="w-[300px] sm:w-[400px] bg-white border border-gray-300 rounded-md shadow-sm px-4 py-1 text-xs font-sans">
            {/* Header */}
            <div className="flex justify-between items-center">
                {/* <img src="https://www.presentations.gov.in/wp-content/uploads/2020/01/NE_Preview1.png" alt="India Emblem" className="h-10 xl:h-12" /> */}
                <img src={Images.adhar1} alt="India Emblem" className="h-10 xl:h-14" />

                <img src={Images.adhar4} alt="Govt of India" className="h-6 xl:h-8" />
                <img src={Images.adhar2} alt="Aadhaar Logo" className="h-14" />
                {/* <img src="https://www.presentations.gov.in/wp-content/uploads/2020/06/Aadhaar_Preview.png" alt="Aadhaar Logo" className="h-12" /> */}
            </div>

            {/* Profile + QR */}
            <div className="flex justify-between items-start gap-4 mt-2 mx-3">
                <div className="flex gap-3 items-start">
                    {/* <img src={imageUrl} alt="Profile" className="w-20 h-24 object-cover border border-gray-400 rounded-sm" /> */}
                    <div className="text-sm space-y-1 text-gray-800">
                        <p><strong>Address: </strong></p>
                        <p>{address || "N/A"}</p>
                    </div>
                </div>
                <img src={Images?.QR} alt="user" className="w-14 h-14 md:w-20 md:h-20 object-cover" />
            </div>

            {/* Aadhaar Number */}
            <div className="mt-2 text-center text-base tracking-widest font-semibold">
                {aadhaarNumber}
            </div>

            {/* Footer line */}
            <div className="mt-1 border-t border-red-600 mb-2" />
            <div className="text-sm text-center font-semibold flex justify-around ">
                <div className="flex">
                    <TbPhone className="w-5 self-center" />
                    1947
                </div>
                <div className="flex ">
                    <TbMail className="w-5 self-center" />
                    help@uidai.gov.in
                </div>
                <div className="flex">
                    <TbWorld className="w-5 self-center" />
                    www.uidai.gov.in
                </div>
            </div>
        </div>
    );
};

export default AdharBack;
