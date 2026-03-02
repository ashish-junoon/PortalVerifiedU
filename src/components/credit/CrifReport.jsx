import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Loader from "../utils/Loader";
import { GetCrifReport } from "../services/Services_API";
import ExperianReport from "./ExperianReport";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import CRIFReportData from "./CrifReportDownload"; // Ensure this is the correct import for CRIFReportData
import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import { useSidebar } from "../Context/SidebarContext";
import DateInput from "../fields/DateInput";

function CrifReport() {
  const { updateWallet } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [crifReport, setCrifReport] = useState(false); // State to control the rendering of CRIFReportData
  const [res, setRes] = useState({});
  const [pdfurl, setpdfurl] = useState(null);
  const personal = res?.data;
  const score = res?.data?.credit_score;
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

  // const report = useFormik({
  //   initialValues: {
  //     fullName: "",
  //     mobile: "",
  //   },
  //   validationSchema: Yup.object({
  //     fullName: Yup.string().required("Full Name is required"),
  //     mobile: Yup.string()
  //       .matches(/^[6-9]\d{9}$/, "Enter a valid mobile number")
  //       .required("Mobile number is required"),
  //   }),
  //   onSubmit: async (values) => {
  //     try {
  //       setLoading(true);
  //       const payload = {
  //         name: values.fullName,
  //         mobile: values.mobile,
  //         consent: true,
  //       };
  //       const respose = await GetCrifReport(payload);

  //       if (respose?.data?.status == "success" || respose?.status == true) {
  //         setpdfurl(respose?.pdfurl);
  //         setLoading(false);
  //         setRes(respose?.data);
  //         setIsReport(true);
  //         setCrifReport(true);
  //         report.resetForm();
  //         toast.success(respose?.message);
  //       } else {
  //         setIsReport(false);
  //         setLoading(false);
  //         setRes({});
  //         toast.error(
  //           respose?.message ||
  //             respose?.data?.error_message ||
  //             "Something went wrong!",
  //         );
  //       }
  //     } catch (error) {
  //       toast.error(error.error_message);
  //       setLoading(false);
  //       setIsReport(false);
  //       setRes({});
  //     } finally {
  //       updateWallet();
  //       setLoading(false);
  //     }
  //   },
  // });

  const report = useFormik({
          initialValues: {
              fullName: '',
              lastName: '',
              mobile: '',
              panNumber: '',
              Address: '',
              city: '',
              state: '',
              village: '',
              pin: '',
              dob: '',
              email: '',
          },
          validationSchema: Yup.object({
              fullName: Yup.string().required('First Name is required'),
              lastName: Yup.string().required('Last Name is required'),
              mobile: Yup.string()
                              .matches(/^[6-9]\d{9}$/, 'Enter a valid mobile number')
                              .required('Mobile number is required'),
              panNumber: Yup.string().required('PAN Number is required'),
              Address: Yup.string().required('Address is required'),
              city: Yup.string().required('City is required'),
              state: Yup.string().required('State is required'),
              pin: Yup.string().required('PIN Code is required'),
              dob: Yup.string().required('Date of Birth is required'),
              village: Yup.string().required('village is required'),
              email: Yup.string()
                      .email('Invalid email')
                      .test(
                        'has-tld',
                        'Email must include a valid domain',
                        value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
                      )
                      .required("Email is required"),
          }),
          onSubmit: async (values, {resetForm}) => {

              const date = values.dob;
              const formatted = date.split("-").reverse().join("-");
              // console.log(formatted);

              const payload = {
                first_name: values.fullName,
                middle_name: "",
                last_name: values.lastName,
                dob: formatted,
                pan_number: values.panNumber,
                email: values.email,
                mobile_number: values.mobile,
                address: values.Address,
                village: values.village,
                city: values.city,
                state: values.city,
                pincode: values.pin
              }

              try {
                  setLoading(true);
                  const response = await GetCrifReport(payload);
                  console.log(response);
                  
                  if (response?.status) {
                      setRes(response);
                      setIsReport(true);
                      setpdfurl(response.data?.credit_report_link)
                      resetForm()
                  } else {
                      toast.error(response?.message || response?.error_message || "Failed to get report.");
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
            <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
              <div className="mb-6">
                <h2 className="text-xl font-semibold italic text-green-600">
                  CRIF Highmark
                </h2>
                <p className="text-xs italic mb-1">
                  CRIF Highmark Credit Report
                </p>
                <div className="border w-full border-green-300 " />
              </div>

              {!loading && !res.length > 0 && (
                // <form onSubmit={report.handleSubmit}>
                //   <div className="grid grid-cols-2 gap-4">
                //     <TextInput
                //       label="Full Name"
                //       name="fullName"
                //       id="fullName"
                //       maxLength={50}
                //       textTransform="capitalize"
                //       value={report.values.fullName}
                //       onChange={report.handleChange}
                //       onBlur={report.handleBlur}
                //       placeholder="Enter your full name"
                //       error={report.touched.fullName && report.errors.fullName}
                //     />

                //     <TextInput
                //       label="Mobile Number"
                //       name="mobile"
                //       id="mobile"
                //       maxLength={10}
                //       value={report.values.mobile}
                //       onChange={report.handleChange}
                //       onBlur={report.handleBlur}
                //       placeholder="Enter your mobile number"
                //       error={report.touched.mobile && report.errors.mobile}
                //     />
                //   </div>

                //   <div className="flex gap-4 items-center justify-center my-5">
                //     <button
                //       type="submit"
                //       className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out text-md font-semibold cursor-pointer    "
                //     >
                //       Get Report
                //     </button>

                //     <button
                //       type="reset"
                //       onClick={report.handleReset}
                //       className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 ease-in-out     cursor-pointer font-semibold text-md"
                //     >
                //       Reset Form
                //     </button>
                //   </div>
                // </form>

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
                      label="PAN Number"
                      name="panNumber"
                      id="panNumber"
                      maxLength={10}
                      textTransform="uppercase"
                      value={report.values.panNumber}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your PAN number"
                      error={
                        report.touched.panNumber && report.errors.panNumber
                      }
                    />

                    <TextInput
                      label="Email"
                      name="email"
                      id="email"
                      maxLength={50}
                      // textTransform="capitalize"
                      value={report.values.email}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your email"
                      error={report.touched.email && report.errors.email}
                    />

                    <div className="col-span-2">
                      <TextInput
                        label="Address"
                        name="Address"
                        id="Address"
                        maxLength={50}
                        textTransform="capitalize"
                        value={report.values.Address}
                        onChange={report.handleChange}
                        onBlur={report.handleBlur}
                        placeholder="Enter your address"
                        error={report.touched.Address && report.errors.Address}
                      />
                    </div>

                    <TextInput
                      label="City"
                      name="city"
                      id="city"
                      maxLength={50}
                      textTransform="capitalize"
                      value={report.values.city}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your city"
                      error={report.touched.city && report.errors.city}
                    />

                    <SelectInput
                      label="State"
                      name="state"
                      id="state"
                      value={report.values.state}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Select"
                      options={stateList.map((state) => ({
                        value: state.code,
                        label: state.name,
                      }))}
                      error={report.touched.state && report.errors.state}
                    />
                    <TextInput
                      label="Village"
                      name="village"
                      id="village"
                      maxLength={50}
                      textTransform="capitalize"
                      value={report.values.village}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your village"
                      error={report.touched.village && report.errors.village}
                    />
                    <TextInput
                      label="PIN Code"
                      name="pin"
                      id="pin"
                      maxLength={6}
                      value={report.values.pin}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your pin code"
                      error={report.touched.pin && report.errors.pin}
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

                    <DateInput
                      label="Date of Birth"
                      name="dob"
                      id="dob"
                      max={new Date().toISOString().split("T")[0]}
                      value={report.values.dob}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Enter your DOB"
                      error={report.touched.dob && report.errors.dob}
                    />

                    {/* <SelectInput
                      label="Gender"
                      name="gender"
                      id="gender"
                      value={report.values.gender}
                      onChange={report.handleChange}
                      onBlur={report.handleBlur}
                      placeholder="Select"
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      error={report.touched.gender && report.errors.gender}
                    /> */}
                  </div>

                  <div className="flex gap-4 items-center justify-center my-5">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out text-md font-semibold cursor-pointer    "
                    >
                      Get Report
                    </button>

                    <button
                      type="reset"
                      onClick={report.handleReset}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 ease-in-out     cursor-pointer font-semibold text-md"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {isReport && Object.keys(res).length > 0 && res.status == true && (
            <div className="w-full mx-auto text-black  mt-0">
              <ExperianReport
                providerName="CRIF Highmark"
                applicantName={personal?.name}
                mobileNumber={personal?.mobile}
                panNumber={personal?.pan}
                creditScore={score}
                onDownloadReport={()=> window.open(personal?.credit_report_link, "_blank")}
                // onDownloadReport={() =>
                //   !pdfurl ? window.open(pdfurl, "_blank") : handleDownload()
                // } 
                // Trigger download report
                onGetNewReport={handleNewReport}
              />
            </div>
          )}

          {/* Display CRIFReportData when download is triggered */}

          {isReport && Object.keys(res).length > 0 && res.status == "error" && (
            <div className="w-full mx-auto text-black  mt-10">
              <p>{res.message}</p>
              <p>Please try again</p>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    "
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

export default CrifReport;
