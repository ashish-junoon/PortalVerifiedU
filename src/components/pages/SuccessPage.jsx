import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { GetMandateDetailsById } from '../services/Services_API';
import { toast } from 'react-toastify';

const SuccessPage = () => {
  const [page, setPage] = useState("");
  const [msg, setMsg] = useState("");
  const [mandate, setmandate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const tid = queryParams.get("id");

  const getmandate = async (req) => {
    try {
      const response = await GetMandateDetailsById(req)
      if(response.status){
        setmandate(response?.data?.id)
      }else{
        toast.error(response?.message)
      }
    } catch (error) {
      console.error("Error in Mandate", error)
    }
  }

  // Set message and redirect page
  useEffect(() => {
    if (type === "pg") {
      setPage("/");
      setMsg("Your Transaction was successful.");
    }else if(type === "ENACH"){
      setPage("/enach/register");
      setMsg("Your ENach Registration was successful.");
      getmandate({TransactionId:tid})
    } else if (type === "aadhaar") {
      setPage("/bureau/aadhar-verification");
      setMsg("Your Aadhaar verification was successful.");
    } else {
      setPage("/");
      setMsg("Your action was successful.");
    }
  }, [type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Success!</h1>
        {mandate && <p className='text-sm'>Mandate Id: {mandate}</p>}
        <p className="text-gray-600 mb-6">{msg}</p>

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition duration-200"
          onClick={() => navigate(page, { replace: true })}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
