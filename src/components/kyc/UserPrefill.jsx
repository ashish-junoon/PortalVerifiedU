import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { GetUserPrefillReport } from "../services/Services_API";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import KycReport from "./KycReport";
import { AuthContext } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";

function UserPrefill() {
    const { updateWallet } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});
    const { isOpenSidebar } = useSidebar()


    const token = JSON.parse(localStorage.getItem('authData'));

    useEffect(() => {
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, [token]);

    const handleDownload = () => {
        // Check if the download link exists
        if (res?.data?.credit_report_link) {
            const element = document.createElement("a");
            element.href = res.data.credit_report_link;
            element.target = "_blank";
            element.download = "report.pdf";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else {
            console.error("No download link available");
            // You might want to show an error message to the user here
        }
    };

    const handleNewReport = () => {
        setLoading(true);
        setRes({});
        setIsReport(false);
        setLoading(false);
    }

    const report = useFormik({
        initialValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            mobile: '',
            // panNumber: '',
            // responseType: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            middleName: Yup.string(),
            lastName: Yup.string().required('Middle Name is required'),
            mobile: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Enter a valid mobile number')
                .required('Mobile number is required'),

            // panNumber: Yup.string().required('PAN Number is required'),
            // responseType: Yup.string().required('Response Type is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const payload = {
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    mobileNumber: values.mobile,
                    // panNumber: values.panNumber,
                    // rsType: values.responseType
                }
                const respose = await GetUserPrefillReport(payload);
                // console.log("Success",respose.data.client_id);
                if (respose.data?.client_id) {
                    setLoading(false);
                    setRes(respose);
                    setIsReport(true);
                    report.resetForm();
                    toast.success(respose.message);
                } else {
                    setIsReport(false);
                    setLoading(false);
                    setRes({});
                    toast.error(respose.message);
                }
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
                setIsReport(false);
                setRes({});
            }
            updateWallet();
        },
    });

    if (loading) return <Loader message="Getting Report..." color="#63BB89" />

    return (
        <div>
            <Helmet>
                <title>VerifiedU</title>
            </Helmet>

            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                <div className={`${isOpenSidebar && "lg:ml-64"} p-3 flex-1`}>
                    {!isReport && Object.keys(res).length === 0 && (
                        <div className="w-full mx-auto text-black  mt-0">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-4 md:p-8 shadow-md rounded">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold italic text-green-600">User Prefill</h2>
                                    <p className="text-xs italic mb-1">User Prefill KYC Report</p>
                                    <div className="border w-full border-green-300 " />
                                </div>


                                <form onSubmit={report.handleSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextInput
                                            label="First name"
                                            name="firstName"
                                            id="firstName"
                                            maxLength={50}
                                            textTransform="capitalize"
                                            value={report.values.firstName}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter your first name"
                                            error={report.touched.firstName && report.errors.firstName}
                                        />
                                        <TextInput
                                            label="Middle name"
                                            name="middleName"
                                            id="middleName"
                                            maxLength={50}
                                            textTransform="capitalize"
                                            value={report.values.middleName}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter your middle name"
                                            error={report.touched.middleName && report.errors.middleName}
                                        />
                                        <TextInput
                                            label="Last name"
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
                                            label="Mobile number"
                                            name="mobile"
                                            id="mobile"
                                            maxLength={10}
                                            value={report.values.mobile}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter your mobile number"
                                            error={report.touched.mobile && report.errors.mobile}
                                        />



                                        {/* <SelectInput
                                                label="Response Type"
                                                name="responseType"
                                                id="responseType"
                                                value={report.values.responseType}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Select"
                                                options={[
                                                    { value: 'PDF', label: 'PDF' },
                                                    // { value: 'JSON', label: 'JSON' },
                                                ]}
                                                error={report.touched.responseType && report.errors.responseType}
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


                                {res && res.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-semibold mb-2">Report</h2>
                                        <div className="border w-full border-green-300 " />
                                        <div className="mt-4">
                                            <p className="text-gray-800  text-base font-medium">{JSON.stringify(res)}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}


                    {isReport && Object.keys(res?.data?.client_id) && (
                        <div className="w-full mx-auto text-black  mt-0">
                            {/* <UserPrefillReport
                                providerName="UserPrefill"
                                applicantName={res?.data?.CIRReportData?.CIRReportData?.PersonalInfo?.Name?.FullName}
                                DateOfBirth={res?.data?.CIRReportData?.CIRReportData?.PersonalInfo?.DateOfBirth}
                                mobileNumber={res?.data?.CIRReportData?.CIRReportData?.PhoneInfo[0]?.Number}
                                panNumber={res?.data?.CIRReportData?.CIRReportData?.IdentityInfo?.PANId[0]?.IdNumber}
                                EmailAddress={res?.data?.CIRReportData?.CIRReportData?.EmailAddressInfo[0]?.EmailAddress}
                                onDownloadReport={handleDownload}
                                onGetNewReport={handleNewReport}
                            /> */}
                            <KycReport report={res.data} type="userPrefill" onGetNewReport={handleNewReport} />
                        </div>
                    )}

                    {isReport && Object.keys(res).length > 0 && res.status == "error" && (
                        <div className="w-full mx-auto text-black  mt-10">
                            <p>{res.message}</p>
                            <p>Please try again</p>
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    ">Try Again</button>
                            <pre>{JSON.stringify(res, null, 2)}</pre>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default UserPrefill;
