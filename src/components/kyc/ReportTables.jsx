import React from "react";
import DataTable from "react-data-table-component";

const customStyles = {
  rows: {
    style: {
      minHeight: "48px",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      fontWeight: "600",
      fontSize: "14px",
    },
  },
  cells: {
    style: {
      padding: "12px",
    },
  },
};

const ReportTables = ({ report }) => {
  const data = report?.CIRReportData?.CIRReportData || {};

  // Extract data sections
  const personal = data.PersonalInfo || {};
  const panIds = data.IdentityInfo?.PANId || [];
  const addresses = data.AddressInfo || [];
  const phones = data.PhoneInfo || [];
  const emails = data.EmailAddressInfo || [];

  return (
    <div className="p-6 space-y-10">
      {/* --- PERSONAL INFO --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Personal Info
        </h2>
        <table className="min-w-full border border-gray-300 rounded-md">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Full Name</td>
              <td className="px-4 py-2">{personal?.Name?.FullName}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Date of Birth</td>
              <td className="px-4 py-2">{personal?.DateOfBirth}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Age</td>
              <td className="px-4 py-2">{personal?.Age?.Age}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Occupation</td>
              <td className="px-4 py-2">{personal?.Occupation}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- PAN INFO --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">PAN Info</h2>
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq, sortable: false },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "PAN Number", selector: (row) => row.IdNumber },
          ]}
          data={panIds}
          customStyles={customStyles}
          pagination
          highlightOnHover
        />
      </div>

      {/* --- ADDRESS INFO --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
          customStyles={customStyles}
          pagination
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
          customStyles={customStyles}
          pagination
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
          customStyles={customStyles}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default ReportTables;
