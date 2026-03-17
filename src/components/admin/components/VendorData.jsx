import React, { useEffect, useState } from "react";
import { vendorFetchServiceAssignList } from "../../services/Services_API";
import DataTable from "react-data-table-component";

const VendorData = ({ userDetails, setOpenVendor }) => {
  const [tableData, setTableData] = useState([]);
  const [filterText, setfilterText] = useState('');

  const VendorServices = async (code) => {
    const req = {
      VendorCode: code,
      url: "Admin/VendorServiceName",
    };
    try {
      const response = await vendorFetchServiceAssignList(req);
      if (response.status) {
        setTableData(response?.getVendorLists);
        // console.log(response?.getVendorLists);
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.error("Error in Fetching User Services : ", error);
    }
  };

  useEffect(() => {
    VendorServices(userDetails?.vendorcode);
  }, []);

  const data = [
    {
      name: "User Name",
      value: userDetails?.username,
    },
    {
      name: "Vendor Name",
      value: userDetails?.vendorname,
    },
    {
      name: "Vendor Code",
      value: userDetails?.vendorcode,
    },
    // {
    //   name: "Type",
    //   value: userDetails?.vendortype,
    // },
    // {
    //   name: "Company Name",
    //   value: userDetails?.companyname,
    // },
    // {
    //   name: "Mobile",
    //   value: userDetails?.mobile,
    // },
    // {
    //   name: "Email",
    //   value: userDetails?.vendoremail,
    // },
    // {
    //   name: "Pan Number",
    //   value: userDetails?.pannumber?.toUpperCase(),
    // },
    // {
    //   name: "Address",
    //   value: userDetails?.officeaddress,
    // },
    // {
    //   name: "City",
    //   value: userDetails?.officecity,
    // },
    // {
    //   name: "State",
    //   value: userDetails?.state,
    // },
    // {
    //   name: "Pin Code",
    //   value: userDetails?.zipcode,
    // },
  ];

  const columns = [
    { name: "Service Id", selector: (row, index) => index + 1,  sortable: true },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
    },
    { name: "Service Type", selector: (row) => row.service_type, sortable: true },
    { name: "Price", selector: (row) => "₹ " + row.price },
    // { name: "Service Type Id", selector: (row) => row.service_type_id },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`ms-2 text-sm font-medium ${row.IsActive ? "text-green-800" : "text-red-800"}`}
        >
          {row.IsActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const filteredData = tableData?.filter((item) => {
        const matchesSearch =
            `${item.vendorname} ${item.service_name} ${item.service_type} ${item.ServiceID} ${item.service_name_id}`
                .toLowerCase()
                .includes(filterText.toLowerCase()) && item?.IsActive

        return matchesSearch;
    });

  return (
    <div className="flex items-center justify-center z-50 px-2 md:px-6 mt-5">
      {/* Background Overlay + Blur */}

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-lg shadow-2xl 
        w-full p-2 md:p-8 animate-popup" >
        
        {/* Close Button */}
        <button
          onClick={() => setOpenVendor(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 
            hover:rotate-90 transition-all text-2xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-wide">
          Vendor Details
        </h2>

        {/* <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
          {data?.map((item, index) => (
            <div key={index} className="flex flex-col">
              <label className="font-semibold text-sm uppercase">
                {item?.name}
              </label>
              <span className="bg-gray-100 py-1.5 px-2 rounded-md border-1 border-gray-200">
                {" "}
                {item?.value || "N/A"}{" "}
              </span>
            </div>
          ))}
        </div> */}

        <div className="mt-2 text-right flex items-center justify-between">
            <div className="flex flex-col">
              <label className="font-medium text-sm uppercase">
                VEndor Code : {userDetails?.vendorcode}
              </label>
            </div>

            <input
            className="mb-2 px-4 py-1 border border-gray-300 rounded-md w-80"
            placeholder="Search here"
            type="text" onChange={(e)=> setfilterText(e.target.value)} />
        </div>

        <div className="border-1 border-gray-200">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            // progressPending={loading}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default VendorData;
