import React from "react";
import DataTable from "react-data-table-component";

const VendorTableAssignList = ({ data }) => {

  const columns = [
    {
      name: "Vendor Code",
      selector: row => row.vendor_code,
      sortable: true,
      wrap: true
    },
    {
      name: "Service Type",
      selector: row => row.service_type,
      sortable: true,
      wrap: true
    },
    {
      name: "Service Name",
      selector: row => row.service_name,
      sortable: true,
      wrap: true
    },
    {
      name: "Price",
      selector: row => row.price,
      sortable: true,
      right: true
    }
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto mt-10">

      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Vendor Service List
      </h2>

      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        dense
        className="border rounded-lg"
      />
    </div>
  );
};

export default VendorTableAssignList;
