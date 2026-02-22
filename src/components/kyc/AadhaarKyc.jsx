import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { GetUserAadhaarReport, GetUserPanReport, GetUserPrefillReport } from "../services/Services_API";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import KycReport from "./KycReport";
import { AuthContext } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";
import SelectInput from "../fields/SelectInput";

function AadhaarKyc() {
    const { updateWallet } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [aadhaarDetails, setAadhaarDetails] = useState({});
    const { isOpenSidebar } = useSidebar()
    const [aadhaarLinkData, setAadhaarLinkData] = useState({});
    const [userData, setUserData] = useState(null);


    const token = JSON.parse(localStorage.getItem('authData'));

    const actionTypes = [
        { label: "Verification Link", value: "LINK" },
        { label: "Verification Status", value: "DETAILS" },
        // { label: "Verification Status", value: "URN" },
    ];

    useEffect(() => {
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, [token]);

    // const handleDownload = () => {
    //     // Check if the download link exists
    //     if (aadhaarDetails?.data?.credit_report_link) {
    //         const element = document.createElement("a");
    //         element.href = aadhaarDetails.data.credit_report_link;
    //         element.target = "_blank";
    //         element.download = "report.pdf";
    //         document.body.appendChild(element);
    //         element.click();
    //         document.body.removeChild(element);
    //     } else {
    //         console.error("No download link available");
    //         // You might want to show an error message to the user here
    //     }
    // };

    const handleNewReport = () => {
        setLoading(true);
        setAadhaarDetails({});
        setIsReport(false);
        setLoading(false);
    }

    const report = useFormik({
        initialValues: {
            aadhaarNo: '',
            action_type: '',
            customer_email: '',
            customer_phone: '',
            customer_name: '',
        },
        validationSchema: Yup.object({
            aadhaarNo: Yup.string()
                .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits")
                .required("Aadhaar Number is required"),
            action_type: Yup.string()
                .oneOf(["LINK", "DETAILS"], "Invalid action type")
                .required("Action type is required"),

            // ----------- LINK -----------
            customer_name: Yup.string().when("action_type", {
                is: "LINK",
                then: (schema) =>
                    schema
                        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
                        .required("Name is required"),
                otherwise: (schema) => schema.notRequired(),
            }),

            customer_email: Yup.string().when("action_type", {
                is: "LINK",
                then: (schema) =>
                    schema
                        .email('Invalid email')
                        .test(
                            'has-tld',
                            'Email must include a valid domain',
                            value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
                        )
                        .required("Email is required"),
                otherwise: (schema) => schema.notRequired(),
            }),

            customer_phone: Yup.string().when("action_type", {
                is: "LINK",
                then: (schema) =>
                    schema
                        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
                        .required("Phone number is required"),
                otherwise: (schema) => schema.notRequired(),
            }),


        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                if (values.action_type === "LINK") {
                    const payload = {
                        full_name: values.customer_name,
                        aadhaar_number: values.aadhaarNo,
                        email_id: values.customer_email,
                        mobile_number: values.customer_phone,
                        product_code: "JC",

                        url: "verifiedu/VerifyAadhaarViaDigilockerLink"
                    }
                    setUserData(payload) // used to populate request data later
                    const respose = await GetUserAadhaarReport(payload);

                    if (respose.success === true) {
                        setLoading(false);
                        setAadhaarLinkData(respose);
                        setIsReport(true);
                        report.resetForm();
                        toast.success(respose.message);
                    } else {
                        setIsReport(false);
                        setLoading(false);
                        setAadhaarLinkData({});
                        toast.error(respose?.message || "Something went wrong!");
                    }
                }

                else if (values.action_type === "DETAILS") {
                    const payload = {
                        Id: values.aadhaarNo,
                        type: "AADHAAR",

                        url: 'verifiedu/GetAadhaarDetailsById',
                    }
                    const respose = await GetUserAadhaarReport(payload);

                    if (respose?.status) {
                        setLoading(false);
                        setAadhaarDetails(respose);
                        // console.log(respose.data.url);
                        // window.location.href = respose.data.url;
                        // window.open(respose.data.url, "_self");
                        // setTimeout(() => {
                        // window.location.reload();
                        // }, 1000);
                        setIsReport(true);
                        report.resetForm();
                        toast.success(respose?.message);
                    } else {
                        setIsReport(false);
                        setLoading(false);
                        setAadhaarDetails({});
                        toast.error(respose?.message || "Something went wrong!");
                    }
                }
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
                setIsReport(false);
                setAadhaarDetails({});
                setAadhaarLinkData({});
            }
            updateWallet();
        },
    });

    if (loading) return <Loader message="Getting Report..." color="#63BB89" />

    // helper function
    const handleCopy = (txt) => {
        navigator.clipboard.writeText(txt)
        toast.success("Aadhar verification link copied")
    }

    return (
        <div>
            <Helmet>
                <title>VerifiedU Login</title>
            </Helmet>

            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                <div className={`${isOpenSidebar && "lg:ml-64"} p-3 flex-1`}>

                    {!isReport && <div className="w-full mx-auto text-black  mt-10">
                        <div className="border border-green-300  md:w-2/3 mx-auto p-3 md:p-8 shadow-md rounded">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold italic text-green-600">Aadhaar Kyc</h2>
                                <p className="text-xs italic mb-1">Aadhaar Kyc Report</p>
                                <div className="border w-full border-green-300 " />
                            </div>

                            {!loading && !aadhaarDetails.length > 0 && (
                                <form onSubmit={report.handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <TextInput
                                            label="Aadhaar Number"
                                            name="aadhaarNo"
                                            id="aadhaarNo"
                                            maxLength={12}
                                            // textTransform="uppercase"
                                            value={report.values.aadhaarNo}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter Aadhaar number"
                                            error={report.touched.aadhaarNo && report.errors.aadhaarNo}
                                        />

                                        <SelectInput
                                            label="Action"
                                            name="action_type"
                                            value={report.values.action_type}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Select"
                                            options={actionTypes}
                                            error={
                                                report.touched.action_type &&
                                                report.errors.action_type
                                            }
                                        />

                                        {report.values.action_type === "LINK" && <>

                                            <TextInput
                                                label="Customer Full Name"
                                                name="customer_name"
                                                value={report.values.customer_name}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter Customer Name"
                                                error={
                                                    report.touched.customer_name && report.errors.customer_name
                                                }
                                            />

                                            <TextInput
                                                label="Customer Email"
                                                name="customer_email"
                                                value={report.values.customer_email}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter email"
                                                maxLength={35}
                                                error={
                                                    report.touched.customer_email &&
                                                    report.errors.customer_email
                                                }
                                            />

                                            <TextInput
                                                label={"Customer Phone"}
                                                name="customer_phone"
                                                value={report.values.customer_phone}
                                                maxLength={10}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter phone"
                                                error={
                                                    report.touched.customer_phone &&
                                                    report.errors.customer_phone
                                                }
                                            />


                                        </>
                                        }
                                    </div>

                                    <div className="flex gap-4 items-center justify-center my-5">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out text-md font-semibold cursor-pointer    "
                                        >
                                            Submit
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

                            {aadhaarDetails && aadhaarDetails.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-2">Report</h2>
                                    <div className="border w-full border-green-300 " />
                                    <div className="mt-4">
                                        <p className="text-gray-800  text-base font-medium">{JSON.stringify(aadhaarDetails)}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    }


                    {/* ================= Aadhaar Status Data UI ================= */}
                    {isReport && aadhaarDetails?.aadhaar_Data && (
                        <div className="w-full mx-auto text-black  mt-2">
                            {/* <UserPrefillReport
                                providerName="UserPrefill"
                                applicantName={aadhaarDetails?.data?.CIRReportData?.CIRReportData?.PersonalInfo?.Name?.FullName}
                                DateOfBirth={aadhaarDetails?.data?.CIRReportData?.CIRReportData?.PersonalInfo?.DateOfBirth}
                                mobileNumber={aadhaarDetails?.data?.CIRReportData?.CIRReportData?.PhoneInfo[0]?.Number}
                                panNumber={aadhaarDetails?.data?.CIRReportData?.CIRReportData?.IdentityInfo?.PANId[0]?.IdNumber}
                                EmailAddress={aadhaarDetails?.data?.CIRReportData?.CIRReportData?.EmailAddressInfo[0]?.EmailAddress}
                                onDownloadReport={handleDownload}
                                onGetNewReport={handleNewReport}
                            /> */}
                            <KycReport report={aadhaarDetails?.aadhaar_Data} type="AadhaarKyc" onGetNewReport={handleNewReport} />
                            {/* {aadhaarDetails?.aadhaar_Data?.status === "initiated"?"Aadhaar verification is in process":<KycReport report={aadhaarDetails?.aadhaar_Data} type="AadhaarKyc" />} */}

                        </div>
                    )}

                    {isReport && Object.keys(aadhaarDetails).length > 0 && aadhaarDetails.status == "error" && (
                        <div className="w-full mx-auto text-black  mt-10">
                            <p>{aadhaarDetails.message}</p>
                            <p>Please try again</p>
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    ">Try Again</button>
                            <pre>{JSON.stringify(aadhaarDetails, null, 2)}</pre>
                        </div>
                    )}


                    {/* ================= Aadhaar Link Data UI ================= */}
                    {isReport && aadhaarLinkData?.success && (
                        <div className="md:w-full w-full mx-auto text-black">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                {/* ================= Header ================= */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            {/* <LinkIcon className="text-green-600" /> */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-green-600 "
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                Aadhaar Verification Link Details
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                Secure link information
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ================= Content ================= */}
                                <div className="p-6 space-y-8">
                                    {/* ===== User Info ===== */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Info
                                            label="Aadhaar Nnumber"
                                            value={userData?.aadhaar_number}
                                        />
                                        <Info label="Name" value={userData?.full_name || "N/A"} />
                                        <Info label="Email" value={userData?.email_id || "N/A"} />
                                        <Info
                                            label="Mobile Number"
                                            value={userData?.mobile_number || "N/A"}
                                        />
                                    </div>

                                    <div className="text-amber-600 font-semibold">Note: Aadhaar verification link will be send through email, sms or whatsapp</div>
                                    {/* ===== Actions ===== */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-0">
                                        <button
                                            onClick={() => { setAadhaarLinkData(null); setIsReport(false) }}
                                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md cursor-pointer"
                                        >
                                            Go Back
                                        </button>

                                        <button
                                            onClick={() => handleCopy(aadhaarLinkData?.data?.url)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md hover:cursor-pointer"
                                        >
                                            Copy Verification Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </div >
            </div >
        </div >
    );
}

/* ================= Small Reusable Components ================= */
const Info = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
        </p>
        <p className="text-lg font-medium text-gray-800">{value || "-"}</p>
    </div>
);

export default AadhaarKyc;
