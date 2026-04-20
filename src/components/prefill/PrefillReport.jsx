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
    <div className="bg-white shadow rounded-lg mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left font-semibold text-gray-700 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 text-primary">
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

const PrefillReport = ({ report, type, onGetNewReport, onDownloadReport = () => console.log("Download report clicked") }) => {
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
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
        User Fusion Report
      </h1>

      {/* Accordion Sections */}
      <AccordionSection icon={<FiUser />} title="Personal Info">
        <table className="w-full border border-gray-200 rounded-md">
          <tbody>
            <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 font-medium">Full Name</td>
              <td className="px-4 py-2 text-primary">{personal?.Name?.FullName}</td>
            </tr>
            <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 font-medium">Date of Birth</td>
              <td className="px-4 py-2">{personal?.DateOfBirth}</td>
            </tr>
            <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-50">
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
            // { name: "State", selector: (row) => row.State },
            // { name: "Postal", selector: (row) => row.Postal },
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
            { name: "Email Address", selector: (row) => row.IdNumber },
          ]}
          data={emails}
          dense
          customStyles={tableStyles}
          highlightOnHover
        />
      </AccordionSection>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {/* { providerName && providerName=='TransUnion' || providerName=='CRIF Highmark'?'':  */}
                    {/* {providerName && providerName == 'CRIF Highmark' ? '' : */}
                        <button
                            onClick={onDownloadReport}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            View Full Report
                        </button>
                        {/* } */}


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
};

export default PrefillReport;