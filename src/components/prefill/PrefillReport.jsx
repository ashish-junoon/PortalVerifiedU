import {
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiRefreshCcw,
  FiChevronDown,
} from "react-icons/fi";
import DataTable from "react-data-table-component";
import { useState } from "react";

const AccordionSection = ({ icon, title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left font-semibold text-gray-700 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 text-indigo-600">
          {icon}
          <span>{title}</span>
        </div>
        <FiChevronDown
          className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
};

const PrefillReport = ({ report, type, onGetNewReport }) => {
  if (type !== "fusion") return null;

  const data = report?.CIRReportData?.IDAndContactInfo || {};
  const personal = data.PersonalInfo || {};
  const panIds = data.Identityinfo?.PANId || [];
  const addresses = data.Identityinfo?.Addressinfo || [];
  const phones = data.Identityinfo?.Phoneinfo || [];
  const emails = data.Identityinfo?.Emailaddressinfo || [];
  const dob = data.Identityinfo?.DobInfo || [];

  const tableStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "13px",
        backgroundColor: "#f7fafc",
        padding: "6px",
        lineHeight: "1.2",
        minHeight: "36px",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
        padding: "6px",
        lineHeight: "1.2",
        minHeight: "36px",
      },
    },
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        User Fusion Report
      </h1>

      {/* Accordion Sections */}
      <AccordionSection icon={<FiUser />} title="Personal Info">
        <table className="w-full border border-gray-200 rounded-md">
          <tbody>
            <tr className="border-b odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 font-medium">Full Name</td>
              <td className="px-4 py-2 text-indigo-600">{personal?.Name?.FullName}</td>
            </tr>
            <tr className="border-b odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 font-medium">Date of Birth</td>
              <td className="px-4 py-2">{personal?.DateOfBirth}</td>
            </tr>
            <tr className="border-b odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 font-medium">Age</td>
              <td className="px-4 py-2">{personal?.Age?.age}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      <AccordionSection icon={<FiCreditCard />} title="PAN Info">
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "PAN Number", selector: (row) => row.IdNumber },
          ]}
          data={panIds}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      <AccordionSection icon={<FiCalendar />} title="DOB Info">
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "DOB", selector: (row) => row.IdNumber },
          ]}
          data={dob}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      <AccordionSection icon={<FiMapPin />} title="Address Info">
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "Address", selector: (row) => row.IdNumber, wrap: true },
            { name: "State", selector: (row) => row.State },
            { name: "Postal", selector: (row) => row.Postal },
          ]}
          data={addresses}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      <AccordionSection icon={<FiPhone />} title="Phone Info">
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "Number", selector: (row) => row.IdNumber },
          ]}
          data={phones}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      <AccordionSection icon={<FiMail />} title="Email Info">
        <DataTable
          columns={[
            { name: "Seq", selector: (row) => row.seq },
            { name: "Reported Date", selector: (row) => row.ReportedDate },
            { name: "Email Address", selector: (row) => row.EmailAddress },
          ]}
          data={emails}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      {/* Action Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={onGetNewReport}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-all duration-200"
        >
          <FiRefreshCcw className="w-5 h-5" />
          Get New Report
        </button>
      </div>
    </div>
  );
};

export default PrefillReport;