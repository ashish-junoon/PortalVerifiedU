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
  const { vendorDetails, servicesDetails, totalserviceHistory } =
    useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const { isOpenSidebar } = useSidebar();
  const services = totalserviceHistory;

  return (
    <div>
      <Helmet>
        <title>Profile | VerifiedU</title>
      </Helmet>

      <Background />

      <div className="flex">
        {isOpenSidebar && <Sidebar />}

        {/* Main Content */}
        <div
          className={`${isOpenSidebar && "lg:ml-64"} w-full min-h-screen bg-gray-100 p-2 md:p-8`}
        >
          <div className="w-full max-w-[1400px] mx-auto bg-white rounded-lg shadow-lg p-3 md:p-6">
            {/* Page Title */}
            {/* Page Title and Wallet Button */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

              <button
                onClick={() => setActiveTab("wallet")}
                className="flex items-center md:gap-2 bg-primary text-white md:px-4 px-2 py-2 rounded-lg shadow hover:bg-primarydark transition-all cursor-pointer"
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
            <div className="flex gap-4 border-b border-gray-300 pb-0 mb-4">
              {["profile", "services", "transactions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium transition-all cursor-pointer
                                        ${
                                          activeTab === tab
                                            ? "text-primary border-b-3 border-primary"
                                            : "text-gray-500 hover:text-gray-700 border-b-3 border-transparent"
                                        }`}
                >
                  {tab === "password"
                    ? "Change Password"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <ProfileTab vendorDetails={vendorDetails} />
            )}
            {activeTab === "services" && <ServiceListTab service={services} />}
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
    {
      label: "Active Status",
      value: vendorDetails.isactive ? "Active" : "Inactive",
    },
    { label: "Address", value: vendorDetails.address },
    { label: "City", value: vendorDetails.city },
    { label: "State", value: vendorDetails.state },
    { label: "Zip Code", value: vendorDetails.zipcode },
    { label: "Company Name", value: vendorDetails.companyname },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Profile Information
      </h2>

      <div className="space-y-2 grid grid-cols-4 gap-x-5 gap-y-2 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:gap-x-2 max-md:gap-y-0 max-md:grid-cols-1">
        {profileFields.map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="w-60 text-gray-500 font-medium">
              {field.label}
            </span>
            <span className="text-gray-800 border border-gray-100 bg-gray-100/70 shadow-sm px-2 py-1 rounded-md">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================
   SERVICE LIST TAB
================================================ */

function ServiceListTab({ service }) {
  // const services = [
  //     { id: 1, name: "PAN Verification", status: "Active" },
  //     { id: 2, name: "Aadhaar Verification", status: "Inactive" },
  //     { id: 3, name: "GST Validation", status: "Active" },
  // ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Your Services
      </h2>

      <div className="border border-gray-100 rounded-lg shadow-sm overflow-y-auto max-h-96">
        {service?.map((s, index) => (
          <div
            key={s.id}
            className={`flex justify-between items-center px-4 py-1.5 border-b border-gray-200 last:border-none hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-gray-100" : ""}`}
          >
            <span className="text-gray-700">{s?.description || "N/A"}</span>
            <span
              className={`px-3 py-1 text-sm rounded-full
                                bg-green-100 text-green-700`}
            >
              ₹ {s?.service_assign_amt}
            </span>
          </div>
        ))}
      </div>

      {false && (
        <div className="bg-white rounded-lg shadow-xl w-full h-96 overflow-y-auto scroll border border-gray-200">
          {service &&
            Object.keys(service[0]).map((serviceKey, i) =>
              service[0][serviceKey].map((serviceItem, index) => (
                <div
                  key={`${i}-${index}`}
                  className={`flex justify-between items-center px-4 py-2 border-b border-gray-200 last:border-none transition duration-200 
          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} 
          hover:bg-primary/10`}
                >
                  {/* Service Name */}
                  <span className="text-gray-700 font-medium">
                    {serviceItem.service_name}
                  </span>

                  {/* Amount Badge */}
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                    ₹ {serviceItem.service_amount}
                  </span>
                </div>
              )),
            )}
        </div>
      )}
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
  const [amount, setAmount] = useState(""); // <-- ADD STATE
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
      user_defined_field_6: vendorDetails?.vendorcode,
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
      console.error("Payment error:", error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 mt-6">
      {/* Wallet Heading */}
      <h2 className="text-2xl font-bold text-primary text-center mb-4">
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
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primarydark transition"
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

import { useFormik } from "formik";
import * as Yup from "yup";

function ForgotPasswordTab() {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),

      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      // console.log(values);
      try {
        // const response = await ChangeVendorPassword()
        if(response.status){
          toast.success(response.message || "Password changed successfully.")
        }else{
          toast.info(response.message || "Problem in Chnaging password!")
        }
      } catch (error) {
        console.error("Error in Changing Password:", error)
      }
      resetForm();
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Change Password
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-2">

          {/* Old Password */}
          <div>
            <label className="text-gray-500 text-sm">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              maxLength={35}
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter old password"
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-500 text-sm">New Password</label>
            <input
              type="password"
              name="newPassword"
              maxLength={35}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter new password"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-500 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              maxLength={35}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Confirm password"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primarydark text-white px-5 py-2 rounded-lg transition mt-4 cursor-pointer"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
