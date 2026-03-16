import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Loader from "../utils/Loader";
import { GetCrifReport, GetCrifReportUid } from "../services/Services_API";
import ExperianReport from "./ExperianReport";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import CRIFReportData from "./CrifReportDownload"; // Ensure this is the correct import for CRIFReportData
import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import { useSidebar } from "../Context/SidebarContext";
import DateInput from "../fields/DateInput";

function CrifReportUID() {
  const { updateWallet } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [crifReport, setCrifReport] = useState(false); // State to control the rendering of CRIFReportData
  const [res, setRes] = useState({});
  const [pdfurl, setpdfurl] = useState(null);
  const personal = res?.DATA;
  const score = res?.DATA?.CREDIT_SCORE;
  // const personal = res?.data?.request;
  //   const score = res?.data?.request?.scores?.score?.["scorE_VALUE"];
  const token = JSON.parse(localStorage.getItem("authData"));
  const { isOpenSidebar } = useSidebar();

  const stateList = [
    { code: "01", name: "Jammu & Kashmir" },
    { code: "02", name: "Himachal Pradesh" },
    { code: "03", name: "Punjab" },
    { code: "04", name: "Chandigarh" },
    { code: "05", name: "Uttarakhand" },
    { code: "06", name: "Haryana" },
    { code: "07", name: "Delhi" },
    { code: "08", name: "Rajasthan" },
    { code: "09", name: "Uttar Pradesh" },
    { code: "10", name: "Bihar" },
    { code: "11", name: "Sikkim" },
    { code: "12", name: "Arunachal Pradesh" },
    { code: "13", name: "Nagaland" },
    { code: "14", name: "Manipur" },
    { code: "15", name: "Mizoram" },
    { code: "16", name: "Tripura" },
    { code: "17", name: "Meghalaya" },
    { code: "18", name: "Assam" },
    { code: "19", name: "West Bengal" },
    { code: "20", name: "Jharkhand" },
    { code: "21", name: "Odisha" },
    { code: "22", name: "Chhattisgarh" },
    { code: "23", name: "Madhya Pradesh" },
    { code: "24", name: "Gujarat" },
    { code: "25", name: "Daman and Diu" },
    { code: "26", name: "Dadra and Nagar Haveli" },
    { code: "27", name: "Maharashtra" },
    { code: "28", name: "Andhra Pradesh" },
    { code: "29", name: "Karnataka" },
    { code: "30", name: "Goa" },
    { code: "31", name: "Lakshadweep" },
    { code: "32", name: "Kerala" },
    { code: "33", name: "Tamil Nadu" },
    { code: "34", name: "Puducherry" },
    { code: "35", name: "Andaman and Nicobar Islands" },
    { code: "36", name: "Telangana" },
    { code: "97", name: "Other Territory" },
    { code: "99", name: "Centre Jurisdiction" },
  ];

  // console.log(res?.data?.request);
  // console.log(res?.data?.scores?.score?.scorE_VALUE);

  useEffect(() => {
    if (!token?.data?.Token && !token?.data?.status) {
      window.location.href = "/login";
    }
  }, [token]);

  // handleDownload function to trigger download report
  // const handleDownload = () => {
  //     console.log('Download triggered');
  //     setCrifReport(true); // This will trigger the CRIFReportData component to render
  // };

  const createHiddenIframe = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    return iframe;
  };

  const handleDownload = async () => {
    const iframe = createHiddenIframe();
    const doc = iframe.contentDocument;

    doc.open();
    doc.write(`
    <html>
      <head>
        <style>
          body { margin:0; font-family: Arial; }
        </style>
      </head>
      <body>
        <div id="pdf-root">
          ${document.getElementById("pdf-content").innerHTML}
        </div>
      </body>
    </html>
    `);
    doc.close();

    await iframe.contentWindow.document.fonts.ready;

    html2pdf()
      .set({
        margin: 0,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      })
      .from(doc.getElementById("pdf-root"))
      .outputPdf("bloburl")
      .then((url) => {
        window.open(url, "_blank");
        document.body.removeChild(iframe);
      });
  };

  // handleNewReport to reset the form and states
  const handleNewReport = () => {
    setLoading(true);
    setRes({});
    setIsReport(false);
    setLoading(false);
    setCrifReport(false); // Reset crifReport to false
    setpdfurl(null);
  };

  const report = useFormik({
    initialValues: {
      fullName: "",
      lastName: "",
      mobile: "",
      uid_number: "",
      dob: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("First Name is required").min(3),
      lastName: Yup.string().required("Last Name is required"),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid mobile number")
        .required("Mobile number is required"),
      //   uid_number: Yup.string().required("PAN Number is required"),
      // dob: Yup.string().required('Date of Birth is required'),
      uid_number: Yup.string()
        .required("PAN or Aadhaar Number is required")
        .test(
          "pan-or-aadhaar",
          "Enter valid PAN or Aadhaar Number",
          function (value) {
            if (!value) return false;

            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            const aadhaarRegex = /^\d{12}$/;

            if (value.length === 10) {
              return panRegex.test(value.toUpperCase());
            }

            if (value.length === 12) {
              return aadhaarRegex.test(value);
            }

            return false;
          },
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      // const date = values.dob;
      // const formatted = date.split("-").reverse().join("-");
      // console.log(formatted);

      const payload = {
        first_name: values.fullName?.trim(),
        last_name: values.lastName?.trim(),
        // dob: formatted,
        uid_number: values.uid_number?.trim(),
        mobile_number: values.mobile?.trim(),
      };

      try {
        setLoading(true);
        const response = await GetCrifReportUid(payload);
        // console.log(response);

        if (response?.STATUS) {
          setRes(response);
          setIsReport(true);
          setpdfurl(response.DATA?.CREDIT_REPORT_LINK);
          resetForm();
        } else {
          toast.error(
            response?.MESSAGE ||
              response?.ERROR_MESSAGE ||
              "Failed to get report.",
          );
          setRes({});
          setIsReport(false);
        }
      } catch (error) {
        toast.error("Something went wrong while fetching report.");
      } finally {
        setLoading(false);
      }
      updateWallet();
    },
  });

  if (loading) return <Loader message="Getting Report..." color="#63BB89" />;

  return (
    <div>
      <Helmet>
        <title>VerifiedU</title>
      </Helmet>
      <div className="flex">
        {isOpenSidebar && <Sidebar />}
        <div
          className={`${
            isOpenSidebar && "lg:ml-64"
          } p-2 w-full mx-auto text-black  mt-2`}
        >
          {!isReport && Object.keys(res).length === 0 && (
            <div className="relative overflow-hidden border border-gray-100  md:w-full mx-auto p-8 shadow-md rounded">
              <div className="absolute bg-primary/10 w-50 h-50 md:top-[-60px] max-md:top-[-100px] right-[-60px] rounded-full"></div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold italic text-primary">
                  CRIF Highmark
                </h2>
                <p className="text-xs italic mb-1">
                  CRIF Highmark Credit Report
                </p>
                <div className="border w-full border-primary/50 " />
              </div>

              {!loading && !res.length > 0 && (
                <form onSubmit={report.handleSubmit}>
                  <div className="grid grid-cols-3 gap-2">
                    <TextInput
                      label="First Name"
                      name="fullName"
                      id="fullName"
                      maxLength={50}
                      textTransform="capitalize"
                      value={report.values.fullName}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your first name"
                      error={report.touched.fullName && report.errors.fullName}
                    />

                    <TextInput
                      label="Last Name"
                      name="lastName"
                      id="lastName"
                      maxLength={50}
                      textTransform="capitalize"
                      value={report.values.lastName}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your last name"
                      error={report.touched.lastName && report.errors.lastName}
                    />

                    <TextInput
                      label="UID"
                      name="uid_number"
                      id="uid_number"
                      maxLength={12}
                      textTransform="uppercase"
                      value={report.values.uid_number}
                      // onChange={report.handleChange}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        report.setFieldValue("uid_number", value);
                      }}
                      onBlur={report.handleBlur}
                      placeholder="Enter your UID"
                      error={
                        report.touched.uid_number && report.errors.uid_number
                      }
                    />

                    <TextInput
                      label="Mobile Number"
                      name="mobile"
                      id="mobile"
                      maxLength={10}
                      value={report.values.mobile}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your mobile number"
                      error={report.touched.mobile && report.errors.mobile}
                    />

                    {/* <DateInput
                      label="Date of Birth"
                      name="dob"
                      id="dob"
                      max={new Date().toISOString().split("T")[0]}
                      value={report.values.dob}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your DOB"
                      error={report.touched.dob && report.errors.dob}
                    /> */}
                  </div>

                  <div className="flex gap-4 items-center justify-center my-5">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primarydark transition duration-300 ease-in-out text-md font-semibold cursor-pointer    "
                    >
                      Get Report
                    </button>

                    <button
                      type="reset"
                      onClick={report.handleReset}
                      className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition duration-300 ease-in-out     cursor-pointer font-semibold text-md"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {isReport && Object.keys(res).length > 0 && res.STATUS == true && (
            <div className="w-full mx-auto text-black  mt-0">
              <ExperianReport
                providerName="CRIF Highmark"
                applicantName={personal?.NAME}
                mobileNumber={personal?.MOBILE}
                panNumber={personal?.UID_NUMBER}
                creditScore={score}
                onDownloadReport={() =>
                  window.open(personal?.CREDIT_REPORT_LINK, "_blank")
                }
                // onDownloadReport={() =>
                //   !pdfurl ? window.open(pdfurl, "_blank") : handleDownload()
                // }
                // Trigger download report
                onGetNewReport={handleNewReport}
              />
            </div>
          )}

          {/* Display CRIFReportData when download is triggered */}

          {isReport && Object.keys(res).length > 0 && res.STATUS == "error" && (
            <div className="w-full mx-auto text-black  mt-10">
              <p>{res.MESSAGE}</p>
              <p>Please try again</p>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    "
                onClick={handleNewReport}
              >
                Try Again
              </button>
              <pre>{JSON.stringify(res, null, 2)}</pre>
            </div>
          )}
        </div>
        {crifReport && <CRIFReportData response={res} />}
      </div>
    </div>
  );
}

export default CrifReportUID;
