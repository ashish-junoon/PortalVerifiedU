import React, { useContext } from "react";
import { AuthContext } from '../Context/AuthContext';
export default function UserCard({ vendorDetails, tillused }) {
    // console.log(user);
  const { wallet,profileImages } = useContext(AuthContext);
    
  return (
    <div className="bg-white shadow-md rounded-tl-lg rounded-tr-lg p-5 hover:shadow-lg transition border border-gray-200/70 border-b-transparent">
      <div className="flex md:items-center gap-10 mb-2 max-md:flex-col">
        <div className="flex items-center gap-3">
          <img
            src={`images/${profileImages}`}
            alt={vendorDetails.vendorname}
            className="md:w-16 md:h-16 rounded-full object-cover border border-gray-200 shadow w-12 h-12"
          />
          
          <div>
            <h2 className="md:text-xl font-semibold text-gray-800">{vendorDetails.vendorname}</h2>
            <p className="text-gray-500">{vendorDetails.vendoremail}</p>
          </div>
        </div>
        
         <div className="md:ml-30">
            <h2 className="md:text-xl font-semibold text-gray-800">Credit Balance</h2>
          <p className="text-gray-500">₹ {wallet && wallet? wallet:0}</p>
        </div>
         
         {/* <div className="md:ml-30">
            <h2 className="md:text-xl font-semibold text-gray-800">Till Used</h2>
          <p className="text-gray-500">₹ {tillused}</p>
        </div> */}
      </div>
      {/* <div className="flex flex-wrap mt-5">
        <ul>
            {user.services.map((service, idx) => (

                <li  key={idx}>{service}</li>
        //   <ServiceBadge key={idx} type={service} />
        ))}
        </ul>
        
      </div> */}
    </div>
  );
}
