import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { GetUserAadhaarReport, GetUserPanReport, GetUserPrefillReport } from "../services/Services_API";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import KycReport from "./KycReport";

function AadhaarMasked() {
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});


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
            aadhaarNo: ''
        },
        validationSchema: Yup.object({
            aadhaarNo: Yup.string().required('Aadhaar Number is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const payload = {
                    aadhaar_uid: values.aadhaarNo.toUpperCase(),
                    url:'verifiedu/VerifyAadhaartoMaskedPAN'
                }
                const respose = await GetUserAadhaarReport(payload);
                   
                if (respose.success===true) {
                    setLoading(false);
                    setRes(respose);
                    setIsReport(true);
                    report.resetForm();
                    toast.success(respose.message);
                } else {
                    console.log("err1",respose);
                    setIsReport(false);
                    setLoading(false);
                    setRes({});
                    toast.error(respose.message);
                }
            } catch (error) {
                console.log("err2");
                toast.error(error.message);
                setLoading(false);
                setIsReport(false);
                setRes({});
            } 
        },
    });

    if (loading) return <Loader message="Getting Report..." color="#63BB89" />

    return (
        <div>
            <Helmet>
                <title>VerifiedU</title>
            </Helmet>

            <div className="flex">
                <Sidebar />
                <div className="ml-64 p-6 flex-1 ">
                    
                        <div className="md:w-7xl w-full mx-auto text-black  mt-10">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold italic text-green-600">Aadhaar Masked</h2>
                                    <p className="text-xs italic mb-1">Aadhaar Masked Bureau</p>
                                    <div className="border w-full border-green-300 " />
                                </div>

                                {!loading && !res.length > 0 && (
                                    <form onSubmit={report.handleSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextInput
                                                label="ID Value"
                                                name="aadhaarNo"
                                                id="aadhaarNo"
                                                maxLength={12}
                                                textTransform="uppercase"
                                                value={report.values.aadhaarNo}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your Aadhaar number"
                                                error={report.touched.aadhaarNo && report.errors.aadhaarNo}
                                            />
                                           
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
                    


                    {isReport && Object.keys(res?.data) && (
                        <div className="w-5xl mx-auto text-black  mt-10">
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
                            <KycReport  report={res?.data} type="AadhaarMasked"/>
                        </div>
                     )} 

                    {isReport && Object.keys(res).length > 0 && res.status == "error" && (
                        <div className="w-5xl mx-auto text-black  mt-10">
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

export default AadhaarMasked;
