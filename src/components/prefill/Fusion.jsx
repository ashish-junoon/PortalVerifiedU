import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import {GetFusionReport } from "../services/Services_API";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import { useSidebar } from "../Context/SidebarContext";
import PrefillReport from "./PrefillReport";

function Fusion() {
    const { updateWallet } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});
    const {isOpenSidebar} = useSidebar()


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
            fullName: '',
            mobile: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full Name is required'),
            mobile: Yup.string()
                            .matches(/^[6-9]\d{9}$/, 'Enter a valid mobile number')
                            .required('Mobile number is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const payload = {
                    name: values.fullName,
                    mobile: values.mobile
                }
                // const respose = await GetFusionReport(payload);
                const respose={
    "timestamp": "2026-03-18T02:07:40.6836568+05:30",
    "transaction_id": "d8ee1619-5804-4b50-9575-3e8938be97bf",
    "status": "success",
    "data": {
        "client_id": "d8ee1619-5804-4b50-9575-3e8938be97bf",
        "CIRReportData": {
            "IDAndContactInfo": {
                "PersonalInfo": {
                    "Name": {
                        "FullName": "REKHA DEVI",
                        "FirstName": null,
                        "LastName": null
                    },
                    "AliasName": null,
                    "DateOfBirth": "22-05-2019",
                    "Gender": null,
                    "Age": {
                        "age": 49
                    },
                    "PlaceOfBirthInfo": null,
                    "IncomeRange": null,
                    "Occupation": null
                },
                "Identityinfo": {
                    "PANId": [
                        {
                            "seq": "1",
                            "ReportedDate": "22-05-2019",
                            "IdNumber": "ZOXPH5777Y"
                        },
                        {
                            "seq": "2",
                            "ReportedDate": "30-04-2016",
                            "IdNumber": "DXNPS7104G"
                        }
                    ],
                    "Addressinfo": [
                        {
                            "seq": "1",
                            "ReportedDate": "31-07-2022",
                            "IdNumber": "B 33/29K 6 N NARIA SUNDAR PUR VARANASI 221001 UP "
                        },
                        {
                            "seq": "2",
                            "ReportedDate": "31-05-2021",
                            "IdNumber": "REKHA DECROTION CENTER  00  B 33/29-K-6 ROHIT NAGAR COLONY NARIYA ROHIT NAGAR COLONY NARIYA LANKA ROAD NEAR BABU GENERAL STORE  and  NEAR PAL JI GENERAL STORE  VARANASI 221005 UP "
                        },
                        {
                            "seq": "3",
                            "ReportedDate": "28-02-2021",
                            "IdNumber": "MAID WORK    NARIYA  NQRIYA ROHIT NAGAR COLONY NEAR SAI SURGERIES NEAR CHAUDHARY LAWN  VARANASI 221005 UP "
                        }
                    ],
                    "Phoneinfo": [
                        {
                            "seq": "1",
                            "ReportedDate": "31-07-2022",
                            "IdNumber": "5644122414"
                        },
                        {
                            "seq": "2",
                            "ReportedDate": "31-05-2021",
                            "IdNumber": "5531465699"
                        },
                        {
                            "seq": "3",
                            "ReportedDate": "22-05-2019",
                            "IdNumber": "5639173859"
                        }
                    ],
                    "Emailaddressinfo": [],
                    "DobInfo": [
                        {
                            "seq": "1",
                            "ReportedDate": "22-05-2019",
                            "IdNumber": "10-11-1977"
                        },
                        {
                            "seq": "2",
                            "ReportedDate": "28-02-2018",
                            "IdNumber": "01-01-1973"
                        },
                        {
                            "seq": "3",
                            "ReportedDate": "30-04-2016",
                            "IdNumber": "01-01-1980"
                        }
                    ],
                    "Voterid": [
                        {
                            "seq": "1",
                            "ReportedDate": "31-07-2022",
                            "IdNumber": "IM853970745139"
                        },
                        {
                            "seq": "2",
                            "ReportedDate": "28-02-2018",
                            "IdNumber": "XC112357118255"
                        }
                    ],
                    "NationalIdCard": [],
                    "OtherId": []
                }
            }
        }
    },
    "message": "success"
};
                if (respose.status == "success") {
                    setLoading(false);
                    setRes(respose);
                    setIsReport(true);
                    report.resetForm();
                    toast.success("Success!");
                } else {
                    setIsReport(false);
                    setLoading(false);
                    setRes({});
                    toast.error(respose?.message || respose?.error_message || "Report could not be generated");
                }
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
                setIsReport(false);
                setRes({});
            } finally {
                
                // toast.error(error.message || "Something went wrong");
                setLoading(false);
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
                <div className="lg:ml-64 md:p-6 p-2 flex-1 "> 
                    {!isReport && Object.keys(res).length === 0 && (
                        <div className="md:w-full w-5xl mx-auto text-black  mt-0">
                            <div className="relative overflow-hidden border border-gray-100  md:w-full mx-auto p-8 shadow-md rounded">
                                <div className="absolute bg-primary/10 w-50 h-50 md:top-[-60px] max-md:top-[-100px] right-[-60px] rounded-full"></div>
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold italic text-primary">Fusion</h2>
                                    <p className="text-xs italic mb-1">Fusion Report</p>
                                    <div className="border w-full border-primary/50" />
                                </div>

                                {!loading && !res.length > 0 && (
                                    <form onSubmit={report.handleSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <TextInput
                                                label="Full name"
                                                name="fullName"
                                                id="fullName"
                                                maxLength={50}
                                                textTransform="capitalize"
                                                value={report.values.fullName}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your full name"
                                                error={report.touched.fullName && report.errors.fullName}
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
                            <PrefillReport report={res.data} type="fusion" onGetNewReport={handleNewReport} />
                        </div>
                    )}

                    {isReport && Object.keys(res).length > 0 && res.status == "error" && (
                        <div className="w-full mx-auto text-black  mt-10">
                            <p>{res.message}</p>
                            <p>Please try again</p>
                            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    ">Try Again</button>
                            <pre>{JSON.stringify(res, null, 2)}</pre>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Fusion;
