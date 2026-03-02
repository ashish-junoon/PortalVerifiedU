import { wrap } from "framer-motion";
import React from "react";
import DataTable from "react-data-table-component";
import AdharCard from "../utils/AdharCard";
import AdharBack from "../utils/AdharBack";



const KycReport = ({ report, type, onGetNewReport, panno }) => {

  if (type == "PanCompre") { // Pan Comprehensive Report Section
    const columns = [
      {
        name: 'Field',
        selector: row => row.field,
        // sortable: true,
      },
      {
        name: 'Value',
        selector: row => row.value,
        // sortable: true,
      },
    ];

    const formattedData = [
      // { field: 'Client ID', value: report.client_id },
      { field: 'PAN Number', value: report.pan_number },
      { field: 'Full Name', value: report.full_name },
      { field: 'Masked Aadhaar', value: report.masked_aadhaar },
      { field: 'Gender', value: report.gender },
      { field: 'Date of Birth', value: report.dob },
      { field: 'Aadhaar Linked', value: report.aadhaar_linked ? 'Yes' : 'No' },
      { field: 'DOB Verified', value: report.dob_verified ? 'Yes' : 'No' },
      // { field: 'Status', value: report.status },
      { field: 'Category', value: report.category },
      // { field: 'Less Info', value: report.less_info ? 'Yes' : 'No' },
    ];

    return (
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-4">Pan Comprehensive Report</h1>
        <DataTable
          columns={columns}
          data={formattedData}

          dense   // 🔹 built-in compact mode
          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '13px',
                // backgroundColor: '#f7fafc',
                padding: '4px 6px',
                lineHeight: '1.2',
                minHeight: '36px',
              },
            },
            cells: {
              style: {
                fontSize: '13px',
                padding: '4px 6px',
                lineHeight: '1.2',
                minHeight: '36px',
              },
            },
          }}
        />
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );
  } else if (type == "PanBasic") { // Pan Comprehensive Report Section
    const columns = [
      {
        name: 'Field',
        selector: row => row.field,
        // sortable: true,
      },
      {
        name: 'Value',
        selector: row => row.value,
        // sortable: true,
        cell: row => typeof row.value == "boolean" ? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ) : row.value,
      },
    ];

    // const formattedData = [
    //   // { field: 'Client ID', value: report.client_id },
    //   { field: 'PAN Number', value: report.pan_number },
    //   { field: 'Full Name', value: report.full_name },
    //   // { field: 'Status', value: report.status },
    //   { field: 'Category', value: report.category },
    // ];

    const formattedData = [
      { field: 'Is Valid', value: report?.is_valid ?? "N/A" },
      { field: 'PAN Number', value: report?.pan_number || "N/A", },
      { field: 'Full Name', value: report?.name || "N/A" || "N/A" },
      // { field: 'Category', value: report?.category || "N/A"},
      { field: 'Date of Birth', value: report?.dob || "N/A" },
      // { field: 'Father Name', value: report?.father_name || 'N/A' },
      // { field: 'GST Amount', value: report?.gst_amount || "N/A"},
      // { field: 'Service Charge', value: report?.service_charge || "N/A"},
      // { field: 'Total (With GST)', value: report?.service_charge_with_gst || "N/A"},
      // { field: 'Status', value: report.status || "N/A"},
      // { field: 'Unique Request Number', value: report?.unique_request_number || "N/A"},
      // { field: 'Created At', value: report?.created_at || "N/A"},
      // { field: 'Failure Reason', value: report?.failure_reason || 'N/A' },
    ];
    return (
      <div className="p-6 max-h-[80vh] overflow-y-auto pr-2" >
        <h1 className="text-2xl font-bold mb-4">PAN Basic Report <span className="font-semibold">{panno && `: ${panno}`}</span></h1>
        <DataTable
          columns={columns}
          data={formattedData}
          dense   // 🔹 built-in compact mode
          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '13px',
                // backgroundColor: '#f7fafc',
                padding: '4px 6px',
                lineHeight: '1.2',
                minHeight: '36px',
              },
            },
            cells: {
              style: {
                fontSize: '13px',
                padding: '4px 6px',
                lineHeight: '1.2',
                minHeight: '36px',
              },
            },
          }}
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );
  }
  else if (type == 'Pan') { // Pan To Mobile Report Section 
    return (
      <div className={`bg-white  rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>

        <div className="p-6">
          <h2 className="mb-5 font-semibold text-xl">PAN to Mobile <span className="font-medium">{panno && `: ${panno}`}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Pan Status</p>
              <p className="text-lg font-medium text-gray-800 ">{report.status}</p>
            </div> */}

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Pan Mobile</p>
              <p className="text-lg font-medium text-gray-800 ">{report.data?.holderMobile[0] || "NA"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500  uppercase tracking-wider">Pan Email </p>
              <p className="text-lg font-medium text-gray-800 ">{report.data?.holderEmail[0] || "NA"}</p>
            </div>


          </div>

        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );

  } else if (type == "AadhaarKyc") { // AadhaarKyc Report Section
    const columns = [
      {
        name: 'Field',
        selector: row => row.field,
        // sortable: true,
      },
      {
        name: 'Value',
        selector: row => row.value,
        // sortable: true,
        cell: row => typeof row.value == "boolean" ? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ) : row.value,
      },
    ];
    const formattedData = [
      // { field: 'Client ID', value: report.client_id },
      { field: 'Aadhaar Number', value: report?.aadhaar_uid || "N/A" },
      { field: 'Status', value: report?.status || "N/A" },
      { field: 'Is Valid', value: report?.is_valid ?? "N/A" },
      { field: 'Name', value: report?.name || "N/A" },
      { field: 'DOB (Masked)', value: report?.date_of_birth_masked || "N/A" },
      // { field: 'Age Range', value: report?.age_range || "N/A"},
      { field: 'Gender', value: report?.gender || "N/A" },
      // { field: 'Mobile Masking', value: report?.last_digits || "N/A"},
    ];

    return (
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-4">Adhar KYC Report</h1>
        {/* <DataTable
          columns={columns}
          data={formattedData}

          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '14px',
                // backgroundColor: '#f7fafc',
              },
            },
            cells: {
              style: {
                fontSize: '14px',
              },
            },
          }}
        /> */}
        <div className="flex justify-center gap-24 my-12">
          <AdharCard
            name={report?.name || "N/A"}
            dob={report?.date_of_birth_masked || "N/A"}
            gender={report?.gender || "N/A"}
            aadhaarNumber={report?.aadhaar_uid || "N/A"}
            image={report?.image || "N/A"}
          />

          <AdharBack
            name={report?.name || "N/A"}
            dob={report?.date_of_birth_masked || "N/A"}
            gender={report?.gender || "N/A"}
            aadhaarNumber={report?.aadhaar_uid || "N/A"}
            image={report?.image || "N/A"}
            address={report?.addresses[0]}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );
  } else if (type == "AadhaarMasked") { // AadhaarKyc Report Section
    const columns = [
      {
        name: 'Field',
        selector: row => row.field,
        // sortable: true,
      },
      {
        name: 'Value',
        selector: row => row.value,
        // sortable: true,
        cell: row => typeof row.value == "boolean" ? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ) : row.value,
      },
    ];
    const formattedData = [
      { field: "Aadhaar Number", value: report.aadhaar_uid },
      { field: "PAN Number", value: report.pan_number_masked },
      { field: "Status", value: report.status },
      { field: "Is Valid", value: report?.is_valid ?? "N/A" },
      { field: "Is Linked", value: report.is_linked },
      // { field: "Service Charge", value: report.service_charge },
      // { field: "GST Amount", value: report.gst_amount },
      // { field: "Total (With GST)", value: report.service_charge_with_gst },
      // { field: "Unique Request Number", value: report.unique_request_number },
      { field: "Created At", value: report.created_at },
      // { field: "Failure Reason", value: report.failure_reason || "N/A" },
    ];

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Ahdar Masked KYC Report </h1>
        <DataTable
          columns={columns}
          data={formattedData}

          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '14px',
                // backgroundColor: '#f7fafc',
              },
            },
            cells: {
              style: {
                fontSize: '14px',
              },
            },
          }}
        />
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );
  } else if (type == "DrivingLicence") {
    const tableData = [
      { field: "Is Valid", value: report?.is_valid ?? "N/A" },
      { field: "DL Number", value: report.dl_number || "N/A" },
      { field: "Name", value: `${report.name} ${report.middle_name || ""}` || "N/A" },
      // { field: "Status", value: report.status },
      { field: "DOB", value: report.dob || "N/A" },
      // { field: "Service Charge", value: report.service_charge },
      // { field: "GST Amount", value: report.gst_amount },
      // { field: "Total (With GST)", value: report.service_charge_with_gst },
      { field: "Pincode", value: report.pincode || "N/A" },
      { field: "Authority", value: report.dl_rto_details?.authority || "N/A" },
      { field: "State", value: report.dl_rto_details?.state || "N/A" },
      { field: "Current Address", value: report.addresses[0]?.complete_address || "N/A" },
      { field: "Parmanent Address", value: report.addresses[1]?.complete_address || "N/A" },
      // { field: "permanent Address", value: String(report.is_valid).toUpperCase() },
      // {
      //   field: "Transport Validity",
      //   value: `${report.transport_validity_from} → ${report.transport_validity_to}`,
      // },
      // {
      //   field: "Non-Transport Validity",
      //   value: `${report.non_transport_validity_from} → ${report.non_transport_validity_to}`,
      // },
      // { field: "Created At", value: new Date(report.created_at).toLocaleString() },
    ];

    // Define columns for vertical display
    const columns = [
      {
        name: "Field",
        selector: (row) => row.field,
        // sortable: true,
        grow: 1,
        style: {
          fontWeight: "600",
          backgroundColor: "#f8fafc",
        },
      },
      {
        name: "Value",
        selector: (row) => row.value,
        grow: 2,
        wrap: true,
        cell: row => typeof row.value == "boolean" ? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ) : row.value,

      },
    ];

    // Tailwind + DataTable custom styles
    const customStyles = {
      rows: {
        style: {
          minHeight: "45px",
          borderBottom: "1px solid #f1f5f9",
        },
      },
      headRow: {
        style: {
          display: "none", // Hide column headers
        },
      },
    };

    return (
      <div className="px-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Driving License Details
        </h2>



        {/* Vertical Data Table */}
        <DataTable
          columns={columns}
          data={tableData}
          dense
          highlightOnHover
          customStyles={customStyles}
        />
        {/* Address Section */}
        {/* <div className="mt-6 text-sm bg-gray-50 p-4 rounded-md border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-2">Addresses:</h3>
          {report.addresses?.map((addr, index) => (
            <p key={index} className="text-gray-600 mb-1">
              <span className="font-semibold capitalize">
                {addr.type.replace("_", " ")}:
              </span>{" "} <br/>
              {addr?.complete_address || "N/A"}
            </p>
          ))}
        </div> */}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center mb-2 gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );

  }
  else {  // User Prefill Report Section
    const customStyles = {
      rows: {
        style: {
          minHeight: "20px",
        },
      },
      headCells: {
        style: {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          fontWeight: "600",
          fontSize: "14px",
          minHeight: "20px",
        },
      },
      cells: {
        style: {
          padding: "5px",
        },
      },
    };
    const data = report?.CIRReportData?.CIRReportData || {};

    // Extract data sections
    const personal = data.PersonalInfo || {};
    const panIds = data.IdentityInfo?.PANId || [];
    const addresses = data.AddressInfo || [];
    const phones = data.PhoneInfo || [];
    const emails = data.EmailAddressInfo || [];

    return (
      <div className="p-6 space-y-5">
        {/* --- PERSONAL INFO --- */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center ">
          User Prefill Report
        </h2>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 ">
            Personal Info
          </h2>
          <table className="min-w-full border border-gray-300 rounded-md">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-1 font-medium">Full Name</td>
                <td className="px-4 py-1">{personal?.Name?.FullName}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-1 font-medium">Date of Birth</td>
                <td className="px-4 py-1">{personal?.DateOfBirth}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-1 font-medium">Age</td>
                <td className="px-4 py-1">{personal?.Age?.Age}</td>
              </tr>
              <tr>
                <td className="px-4 py-1 font-medium">Occupation</td>
                <td className="px-4 py-1">{personal?.Occupation}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- PAN INFO --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">PAN Info</h2>
          <DataTable
            columns={[
              { name: "Seq", selector: (row) => row.seq, sortable: false },
              { name: "Reported Date", selector: (row) => row.ReportedDate },
              { name: "PAN Number", selector: (row) => row.IdNumber },
            ]}
            data={panIds}
            dense   // 🔹 built-in compact mode
            customStyles={{
              headCells: {
                style: {
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#f7fafc',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
              cells: {
                style: {
                  fontSize: '13px',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
            }}

            highlightOnHover
          />
        </div>

        {/* --- ADDRESS INFO --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 ">
            Address Info
          </h2>
          <DataTable
            columns={[
              { name: "Seq", selector: (row) => row.Seq, sortable: false },
              { name: "Reported Date", selector: (row) => row.ReportedDate },
              { name: "Address", selector: (row) => row.Address, wrap: true },
              { name: "State", selector: (row) => row.State },
              { name: "Postal", selector: (row) => row.Postal },
            ]}
            data={addresses}
            dense   // 🔹 built-in compact mode
            customStyles={{
              headCells: {
                style: {
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#f7fafc',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
              cells: {
                style: {
                  fontSize: '13px',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
            }}

            highlightOnHover
          />
        </div>

        {/* --- PHONE INFO --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Phone Info</h2>
          <DataTable
            columns={[
              { name: "Type", selector: (row) => row.Type },
              { name: "Reported Date", selector: (row) => row.ReportedDate },
              { name: "Number", selector: (row) => row.Number },
            ]}
            data={phones}
            dense   // 🔹 built-in compact mode
            customStyles={{
              headCells: {
                style: {
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#f7fafc',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
              cells: {
                style: {
                  fontSize: '13px',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
            }}

            highlightOnHover
          />
        </div>

        {/* --- EMAIL INFO --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Info</h2>
          <DataTable
            columns={[
              { name: "Seq", selector: (row) => row.seq },
              { name: "Reported Date", selector: (row) => row.ReportedDate },
              { name: "Email Address", selector: (row) => row.EmailAddress },
            ]}
            data={emails}
            dense   // 🔹 built-in compact mode
            customStyles={{
              headCells: {
                style: {
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#f7fafc',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
              cells: {
                style: {
                  fontSize: '13px',
                  padding: '4px 6px',
                  lineHeight: '1.2',
                  minHeight: '36px',
                },
              },
            }}

            highlightOnHover
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={onGetNewReport}
            className="flex-1 flex items-center justify-center gap-2 bg-white  border border-gray-300  hover:bg-gray-50  text-gray-800  font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Report
          </button>
        </div>
      </div>
    );
  }

};

export default KycReport;
