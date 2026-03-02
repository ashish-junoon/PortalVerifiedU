import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { GetUserBankReport } from "../services/Services_API";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import BankReport from "./BankReport";
import SelectInput from "../fields/SelectInput";
import { AuthContext } from '../Context/AuthContext';
import { useSidebar } from "../Context/SidebarContext";
function BankDetails() {
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});
    const { deductAmount, updateWallet } = useContext(AuthContext);
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
            account: '',
            ifsc: '',
            verification_type: '',
            // responseType: ''
        },
        validationSchema: Yup.object({
            account: Yup.string().required('Account number is required')
                .matches(/^\d+$/, 'Account number must contain only digits')
                .min(8, 'Account number must be at least 8 digits')
                .max(20, 'Account number must be at most 20 digits'),
            ifsc: Yup.string()
                .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
                .required("IFSC is required"),
            verification_type: Yup.string().required('Verification type is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const payload = {
                    account_number: values.account,
                    account_ifsc: values.ifsc,
                    verification_type: values.verification_type,
                    // ifsc_details: true,
                    // url:'Services/VerifyBankAccountPennyDrop' // fine B
                    url: 'verifiedu/VerifyBankAccountNumber'
                }
                const respose = await GetUserBankReport(payload);
                if (respose.success == true) {
                    deductAmount(1);
                    setLoading(false);
                    setRes(respose);
                    setIsReport(true);
                    report.resetForm();
                    toast.success(respose.message);
                } else {
                    console.log("err1", respose);
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

                    {!isReport &&
                        <div className="w-full mx-auto text-black  mt-10">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-4 md:p-8 shadow-md rounded">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold italic text-green-600">Bank Details</h2>
                                    <p className="text-xs italic mb-1">Verify Bank Details</p>
                                    <div className="border w-full border-green-300 " />
                                </div>

                                {!loading && !res.length > 0 && (
                                    <form onSubmit={report.handleSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextInput
                                                label="Account No."
                                                name="account"
                                                id="account"
                                                maxLength={50}
                                                textTransform="capitalize"
                                                value={report.values.account}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your account number"
                                                error={report.touched.account && report.errors.account}
                                            />
                                            <TextInput
                                                label="IFSC Code"
                                                name="ifsc"
                                                id="ifsc"
                                                maxLength={50}
                                                textTransform="capitalize"
                                                value={report.values.ifsc}
                                                onChange={(e) => report.setFieldValue('ifsc', e.target.value.toUpperCase())}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your ifsc code"
                                                error={report.touched.ifsc && report.errors.ifsc}
                                            />
                                            <SelectInput
                                                label="Verification type"
                                                name="verification_type"
                                                id="verification_type"
                                                value={report.values.verification_type}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Select"
                                                options={[
                                                    { value: 'penny_drop', label: 'Pennydrop' },
                                                    { value: 'pennyless', label: 'pennyless' },
                                                    { value: 'paisa_drop', label: 'Paisadrop' }
                                                ]}
                                                error={report.touched.verification_type && report.errors.verification_type}
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
                    }



                    {isReport && Object.keys(res?.success) && (
                        <div className="w-full mx-auto text-black  mt-2">
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
                            <BankReport report={res.data} onGetNewReport={handleNewReport} />
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

export default BankDetails;
