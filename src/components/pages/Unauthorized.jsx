import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard"); // 👈 change to "/" if you want home instead
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup when component unmounts
  }, [navigate]);

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-50">
    //   <div className="bg-white shadow-lg rounded-lg p-8 text-center">
    //     <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Access Denied</h1>
    //     <p className="text-gray-700 text-lg mb-2">
    //       You are not allowed to view this page.
    //     </p>
    //     <p className="text-sm text-gray-500">
    //       Redirecting to the dashboard in 3 seconds...
    //     </p>
    //   </div>
    // </div>

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full border border-gray-100">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-red-100 text-red-600 px-4 py-5 rounded-full text-4xl">
            ❌
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h1>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          You are not authorized to access this page.
        </p>

        <p className="text-sm text-gray-400 mb-6">
          Redirecting to dashboard in{" "}
          <span className="font-semibold">3 seconds</span>...
        </p>

        {/* Button */}
        <Link to="/" className="bg-primary hover:bg-primarydark text-white px-6 py-2 rounded-lg transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
