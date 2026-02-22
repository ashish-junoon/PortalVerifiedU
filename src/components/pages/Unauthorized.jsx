import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard"); // 👈 change to "/" if you want home instead
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup when component unmounts
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Access Denied</h1>
        <p className="text-gray-700 text-lg mb-2">
          You are not allowed to view this page.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to the dashboard in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
