import React, { useContext, useState } from "react";
import Sidebar from "../Sidebar";
import { Helmet } from "react-helmet";
import Background from "../utils/Background";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { vendorPayment } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import TransactionHistory from "../TransactionHistory";
export default function ProfilePage() {
    const { vendorDetails, servicesDetails } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("profile");
    const { isOpenSidebar } = useSidebar()

    return (
        <div>
            <Helmet>
                <title>Profile | VerifiedU</title>
            </Helmet>

            <Background />

            <div className="flex">
                {isOpenSidebar && <Sidebar />}

                {/* Main Content */}
                <div className={`${isOpenSidebar && "lg:ml-64"} w-full min-h-screen bg-gray-100 p-2 md:p-8`}>

                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-3 md:p-6">

                        {/* Page Title */}
                        {/* Page Title and Wallet Button */}
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-bold text-gray-800">
                                My Profile
                            </h1>

                            <button
                                onClick={() => setActiveTab("wallet")}
                                className="flex items-center md:gap-2 bg-green-600 text-white md:px-4 px-2 py-2 rounded-lg shadow hover:bg-green-700 transition-all cursor-pointer"
                            >
                                {/* Optional icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 12v8m0 0l-3-3m3 3l3-3"
                                    />
                                </svg>
                                Wallet Recharge
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-300 pb-2 mb-4">

                            {["profile", "services", "transactions"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 text-lg font-medium transition-all cursor-pointer
                                        ${activeTab === tab
                                            ? "text-green-600 border-b-2 border-green-600"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab === "password" ? "Password Reset" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}

                        </div>

                        {/* Tab Content */}
                        {activeTab === "profile" && <ProfileTab vendorDetails={vendorDetails} />}
                        {activeTab === "services" && <ServiceListTab servicesDetails={servicesDetails} />}
                        {activeTab === "transactions" && <TransactionsListTab />}
                        {activeTab === "password" && <ForgotPasswordTab />}
                        {activeTab === "wallet" && <WalletRecharge />}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================================================
   PROFILE TAB (View Only)
================================================ */

function ProfileTab({ vendorDetails }) {
    // const profile = {
    //     username: "Ravi",
    //     vendorcode: "TXT",
    //     vendorname: "Ravi Sharma",
    //     vendorfirstname: "Ravi",
    //     vendorlastname: "Sharma",
    //     vendoremail: "user@example.com",
    //     mobile: "9625555555",
    //     gender: "male",
    //     ipaddress: "1.0.0.0",
    //     isactive: true,
    //     address: "delhi",
    //     city: "dwarka",
    //     state: "delhi",
    //     zipcode: "110001",
    //     companyname: "ABC",
    //     officeaddress: "dawrka",
    //     officecity: "dwarka",
    //     officestate: "delhi",
    //     officelandline: "012456987",
    //     officezipcode: "112345",
    //     token: "QQBCAEMALQAxADAALQBOAG8AdgAtADIAMAAyADUA"
    // };

    const profileFields = [
        { label: "Username", value: vendorDetails.username },
        // { label: "Vendor Code", value: vendorDetails.vendorcode },
        { label: "Vendor Name", value: vendorDetails.vendorname },
        { label: "Email", value: vendorDetails.vendoremail },
        { label: "Mobile", value: vendorDetails.mobile },
        { label: "Gender", value: vendorDetails.gender },
        { label: "Active Status", value: vendorDetails.isactive ? "Active" : "Inactive" },
        { label: "Address", value: vendorDetails.address },
        { label: "City", value: vendorDetails.city },
        { label: "State", value: vendorDetails.state },
        { label: "Zip Code", value: vendorDetails.zipcode },
        { label: "Company Name", value: vendorDetails.companyname },

    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile Information</h2>

            <div className="space-y-2">
                {profileFields.map((field, idx) => (
                    <div key={idx} className="flex">
                        <span className="w-60 text-gray-500 font-medium">{field.label}</span>
                        <span className="text-gray-800">{field.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


/* ================================================
   SERVICE LIST TAB
================================================ */

function ServiceListTab({ servicesDetails }) {
    // const services = [
    //     { id: 1, name: "PAN Verification", status: "Active" },
    //     { id: 2, name: "Aadhaar Verification", status: "Inactive" },
    //     { id: 3, name: "GST Validation", status: "Active" },
    // ];

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Services</h2>

            <div className="border border-gray-300 rounded-lg shadow-sm overflow-y-auto max-h-96">
                {servicesDetails.map((s) => (
                    <div
                        key={s.id}
                        className="flex justify-between items-center px-4 py-2 border-b border-gray-300 last:border-none hover:bg-gray-50 transition"
                    >
                        <span className="text-gray-700">{s.servicename}</span>
                        <span
                            className={`px-3 py-1 text-sm rounded-full
                                bg-green-100 text-green-700`}
                        >
                            ₹ {s.serviceamount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ================================================
   TRANSACTIONS TAB
================================================ */

function TransactionsListTab({ transactionDetails }) {
    // const services = [
    //     { id: 1, name: "PAN Verification", status: "Active" },
    //     { id: 2, name: "Aadhaar Verification", status: "Inactive" },
    //     { id: 3, name: "GST Validation", status: "Active" },
    // ];

    return (
        <div>
            {/* <h2 className="text-xl font-semibold text-gray-700 mb-0">Your Transactions</h2> */}

            <TransactionHistory />
        </div>
    );
}

/* ================================================
   Wallet Recharge
================================================ */
function WalletRecharge() {
    const { vendorDetails, wallet, profileImages } = useContext(AuthContext);
    const [iswallet, setWallet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");  // <-- ADD STATE
    const navigate = useNavigate();


    const handleWallet = async () => {

        if (!amount) {
            setWallet("Please enter a valid amount");

            return;
        } else if (Number(amount) < 1000) {
            setWallet("Please enter a minimum of 1000");

            return;

        }

        const payload = {
            amount: amount,
            email: vendorDetails.vendoremail,
            phone: vendorDetails.mobile,
            firstname: vendorDetails.vendorname,
            productinfo: "wallet recharge",
            success_url: `${window.location.origin}/success`,
            failed_url: `${window.location.origin}/failure`,

            //Newly Added Paramenters
            company_name: "JUNOON",
            product_name: "JC",
            user_defined_field_1: "",
            user_defined_field_2: "",
            user_defined_field_3: "",
            user_defined_field_6: vendorDetails?.vendorcode
        };

        try {
            setWallet("");
            setLoading(true);
            const response = await vendorPayment(payload);

            if (response.status) {
                window.open(response.data, "_self");

            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 mt-6">
            {/* Wallet Heading */}
            <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
                Wallet Recharge
            </h2>

            {/* Optional Wallet Icon */}
            <div className="flex justify-center mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a4 4 0 00-8 0v2M5 11h14v10H5V11z"
                    />
                </svg>
            </div>

            {/* Wallet Amount Input */}
            <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                    Enter Recharge Amount
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                {iswallet && <p className="text-red-600 text-sm mt-1">{iswallet}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={handleWallet}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    {loading ? "Processing..." : "Submit"}
                </button>
            </div>
        </div>



    );
}
/* ================================================
   FORGOT PASSWORD TAB
================================================ */

function ForgotPasswordTab() {
    const [email, setEmail] = useState("");

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Password Reset</h2>

            <div>
                <label className="text-gray-500 text-sm">Registered Email</label>
                <input
                    type="email"
                    maxLength={35}
                    className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                onClick={() => alert("Reset link sent")}
            >
                Send Reset Link
            </button>
        </div>
    );
}

