// FailurePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/solid'; // Heroicons v2
import { GetMandateDetailsById, GetPaymentDetailsById } from '../services/Services_API';
import { toast } from 'react-toastify';

const FailurePage = ({ fromAction }) => {
  const [page, setPage] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id");
  const type = queryParams.get("type");
  const [mandateResponse, setMandateResponse] = useState(null);

  // functions based on type parameter

  const GetMandateDetails = async () => {

    setPage("/enach/register");
    setMsg("Your ENACH was not successful. Please try again!")
    const req = {
      TransactionId: id,
    };
    if (id) {
      try {
        const response = await GetMandateDetailsById(req);
        if (response.status) {
          setMandateResponse(response);
          console.log(response);

        } else {
          toast.error(response.message || "Something went wrong!");
          console.log(response);
        }
        // console.log(mandateDetails);
      } catch (error) {
        console.error("Error in GetPaymentDetailsById", error);
      }
    }
  };

  // Set page based on query param
  useEffect(() => {
    if (type === "pg") {
      setPage("/profile");
      setMsg("Your Transaction was not successful. Please try again!")
    } else if (type === "ENACH") {
      GetMandateDetails();
    } else if (type === "aadhaar") {
      console.log('ddd');
      setPage("/bureau/aadhar-verification");
      setMsg("Your aadhar verification was not successful. Please try again!")
    } else {
      setPage("/");
      setMsg("Something went wrong!. Please try again!")
    }
  }, [type]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Action Failed!</h1>
        <p className="text-gray-600 mb-2">
          {msg}
        </p>
        {type === "ENACH" && mandateResponse && <p className="text-amber-600 mb-2">
          Faluire Reason: {mandateResponse?.data?.response_meta?.description}
        </p>}
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold mt-4 py-2 px-6 rounded transition duration-200"
          onClick={() => navigate(`${page}`, { replace: true })}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default FailurePage;
