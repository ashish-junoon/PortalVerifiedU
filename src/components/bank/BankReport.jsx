import React from "react";
import DataTable from "react-data-table-component";

const BankReport = ({ report, type, onGetNewReport, gstno }) => {
  if (type === 'UPI') {


    const tableData = [
      { field: "VPA", value: report.vpa },
      { field: "VPA Holder Name", value: report.vpa_holder_name },
      // { field: "Status", value: report.status },
      // { field: "Service Charge", value: report.service_charge },
      // { field: "GST Amount", value: report.gst_amount },
      // { field: "Total (With GST)", value: report.service_charge_with_gst },
      // { field: "Unique Request Number", value: report.unique_request_number },
      // { field: "Created At", value: report.created_at },
      { field: "Is Valid", value: report?.is_valid ?? "N/A"},
      // { field: "Failure Reason", value: report.failure_reason || "N/A" },
      // { field: "Is Fuzzy Match", value: report.is_fuzzy_match ? "Yes" : "No" },
      // { field: "Fuzzy Match Text", value: report.fuzzy_match_text || "N/A" },
      // { field: "Fuzzy Match Percentage", value: report.fuzzy_match_percentage || "N/A" },
    ];

    // 🧩 Define columns for DataTable
    const columns = [
      {
        name: "Field",
        selector: (row) => row.field,
        // sortable: true,
        wrap: true,
        grow: 1,
      },
      {
        name: "Value",
        selector: (row) => row.value,
        // sortable: true,
        wrap: true,
        grow: 2,
        cell: row => typeof row.value == "boolean"? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ):row.value,
      },
    ];

    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          UPI Verification Details
        </h1>
        <DataTable
          columns={columns}
          data={tableData}
          // pagination
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
          highlightOnHover
          striped
          className="rounded-lg border border-gray-200 shadow-sm"
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

  } else if (type === 'IFSC') {


    const tableData = [
      { field: "Is Valid", value: report?.is_valid ?? "N/A" },
      { field: "IFSC", value: report.ifsc || "N/A"},
      { field: "Bank Name", value: report.bank_name || "N/A"},
      { field: "Branch Name", value: report.bank_branch || "N/A"},
      { field: "Bank Address", value: report.bank_address || "N/A"},
      // { field: "Status", value: report.status || "N/A"},
      // { field: "Service Charge", value: report.service_charge || "N/A"},
      // { field: "GST Amount", value: report.gst_amount || "N/A"},
      // { field: "Total (With GST)", value: report.service_charge_with_gst || "N/A"},
      { field: "Bank City", value: report.bank_city || "N/A"},
      // { field: "Uique Request Number", value: report.unique_request_number || "N/A"},
      { field: "Bank State", value: report.bank_state || "N/A"},
      // { field: "Reg. Date", value: report.created_at || "N/A"},
    ];

    // 🧩 Define columns for DataTable
    const columns = [
      {
        name: "Field",
        selector: (row) => row.field,
        // sortable: true,
        wrap: true,
        grow: 1,
      },
      {
        name: "Value",
        selector: (row) => row.value,
        // sortable: true,
        wrap: true,
        grow: 2,
        cell: row => typeof row.value == "boolean"? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ):row.value,
      },
    ];



    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          IFSC Report
        </h1>
        <DataTable
          columns={columns}
          data={tableData}
          // pagination
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
          highlightOnHover
          striped
          className="rounded-lg border border-gray-200 shadow-sm"
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

  } else if (type === 'GST') {

    // console.log(report.is_valid)
    const tableData = [
      // { field: "GSTIN", value: report.id },
      { field: "Business Name", value: report.legal_name_of_business || "N/A" },
      { field: "Trade Name", value: report.trade_name_of_business || "N/A" },
      // { field: "Status", value: report.status || "N/A" },
      // { field: "Service Charge", value: report.service_charge || "N/A" },
      // { field: "GST Amount", value: report.gst_amount || "N/A" },
      // { field: "Total (With GST)", value: report.service_charge_with_gst || "N/A" },
      { field: "GSTIN Status", value: report.gstin_status || "N/A" },
      { field: "Valid", value: report.is_valid ?? "N/A" },
      { field: "City", value: report.principal_place_city || "N/A" },
      { field: "Pin Code", value: report.principal_place_pincode || "N/A" },
      { field: "State", value: report.principal_place_state || "N/A" },
      { field: "Reg. Date", value: report.registration_date || "N/A" },
    ];

    // 🧩 Define columns for DataTable
    const columns = [
      {
        name: "Field",
        selector: (row) => row.field,
        // sortable: true,
        wrap: true,
        grow: 1,
      },
      {
        name: "Value",
        selector: (row) => row.value,
        // sortable: true,
        wrap: true,
        grow: 2,
        cell: row => typeof row.value == "boolean"? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ):row.value,
      },
    ];

    // 🎨 Custom Styling
    const customStyles = {
      headCells: {
        style: {
          fontWeight: "700",
          fontSize: "15px",
          backgroundColor: "#f9fafb",
        },
      },
      cells: {
        style: {
          fontSize: "14px",
        },
      },
    };

    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          GST Verification Details <span className="font-medium">{gstno && `: ${gstno}`}</span>
        </h1>
        <DataTable
          columns={columns}
          data={tableData}
          // pagination
          dense   // 🔹 built-in compact mode
          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '13px',
                // // backgroundColor: '#f7fafc',
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
          striped
          className="rounded-lg border border-gray-200 shadow-sm"
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

  } else {


    const data = report;
    console.log(data);
    let tableData = '';
    // 🧾 Flatten the data for the table
    if (data.account_holder_name) {
      tableData = [
        { field: "Account Exists", value: data?.is_valid ?? "N/A" },
        { field: "Account holder Name", value: data.account_holder_name },
        // { field: "Status", value: data.status ? "True" : "False" },
        // { field: "Remarks", value: data.failure_reason || "N/A" }, // Assuming failure_reason could be null
        { field: "Account No", value: data.account_number },
        // { field: "Bank Name", value: "N/A" }, // Bank Name info is not available in the provided data
        { field: "IFSC Code", value: data.account_ifsc },
        // { field: "Verification Type", value: data.verification_type },
        // { field: "Unique Request Number", value: data.unique_transaction_reference },
        // { field: "Unique Transaction Reference", value: data.unique_request_number },
        // { field: "Reference ID", value: data.id },
      ];

    } else {

      tableData = [
        // { field: "Full Name", value: data?.full_name  || "N/A"},
        // { field: "Status", value: data.status ? "True" : "False" || "N/A" },
        // { field: "Remarks", value: data.remarks  || "N/A"},
        // { field: "IMPS Ref No", value: data?.imps_ref_no || "N/A"},
        { field: "Account Exists", value: data?.is_valid ?? "N/A"},
        // { field: "Bank Name", value: data.ifsc_details?.bank || "N/A"},
        { field: "Account Number", value: data?.account_number || "N/A"},
        { field: "IFSC Code", value: data?.account_ifsc || "N/A"},
        { field: "Verification Type", value: data?.verification_type || "N/A"},
        // { field: "MICR Code", value: data.ifsc_details?.micr || "N/A"},
        // { field: "Branch", value: data.ifsc_details?.branch || "N/A"},
        // { field: "City", value: data.ifsc_details?.city || "N/A"},
        // { field: "District", value: data.ifsc_details?.district || "N/A"},
        // { field: "State", value: data.ifsc_details?.state || "N/A"},
        // { field: "Address", value: data.ifsc_details?.address || "N/A"},
        // { field: "Transaction Type", value: data.transaction_info?.txn_type || "N/A"},
        // { field: "Transaction Ref ID", value: data.transaction_info?.nw_txn_refid || "N/A"},
        // { field: "Request ID", value: data.transaction_info?.reqid || "N/A"},
        // { field: "Reference ID", value: data.transaction_info?.reference_id || "N/A"},
      ];
    }

    // 🧩 Define columns for DataTable
    const columns = [
      {
        name: "Field",
        selector: (row) => row.field,
        // sortable: true,
        wrap: true,
        grow: 1,
      },
      {
        name: "Value",
        selector: (row) => row.value,
        // sortable: true,
        wrap: true,
        grow: 2,
        cell: row => typeof row.value == "boolean"? (
          <span
            style={{
              color: row.value ? "green" : "red",
              fontWeight: 600
            }}
          >
            {row.value ? "Yes" : "No"}
          </span>
        ):row.value,
      },
    ];

    // 🎨 Custom Styling
    const customStyles = {
      headCells: {
        style: {
          fontWeight: "700",
          fontSize: "15px",
          backgroundColor: "#f9fafb",
        },
      },
      cells: {
        style: {
          fontSize: "14px",
        },
      },
    };

    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Bank Verification Details
        </h1>
        <DataTable
          columns={columns}
          data={tableData}
          // pagination
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
          striped
          className="rounded-lg border border-gray-200 shadow-sm"
        />

        {data?.failure_reason && <>
          <div className="text-red-600 my-4 text-sm">Failure Reason: {data?.failure_reason}</div>
        </>}

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

export default BankReport;
