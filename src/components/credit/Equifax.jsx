import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import Loader from "../utils/Loader";
import ExperianReport from "./ExperianReport";
import Sidebar from "../Sidebar";

function Equifax() {
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
            firstName: '',
            lastName: '',
            middleName: '',
            Address: '',
            State: '',
            pincode: '',
            mobile: '',
            dob: '',
            idType: '',
            panNumber: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            middleName: Yup.string(), // Optional, but you can add validation if needed
            Address: Yup.string().required('Address is required'),
            State: Yup.string().required('State is required'), 
            pincode: Yup.string()
                .matches(/^\d{6}$/, 'PIN Code must be exactly 6 digits')
                .required('PIN Code is required'),
            mobile: Yup.string()
                            .matches(/^[6-9]\d{9}$/, 'Enter a valid mobile number')
                            .required('Mobile number is required'),
            dob: Yup.date()
                .required('Date of Birth is required')
                .typeError('Invalid date format'),
            idType: Yup.string().required('ID Type is required'),
            panNumber: Yup.string()
                .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number')
                .required('PAN Number is required'),
        }),
        onSubmit: async (values) => {
            alert(JSON.stringify(values, null, 2));
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
                    {!isReport && Object.keys(res).length === 0 && (
                        <div className="md:w-7xl w-full mx-auto text-black  mt-10">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold italic text-green-600">Equifax</h2>
                                    <p className="text-xs italic mb-1">Equifax Credit Bureau</p>
                                    <div className="border w-full border-green-300 " />
                                </div>

                                {!loading && !res.length > 0 && (
                                    <form onSubmit={report.handleSubmit}>
                                        <div className="grid grid-cols-3 gap-4">
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

                                            <div className="col-span-3">
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


                                            {/* <SelectInput
                                                label="State"
                                                name="State"
                                                id="State"
                                                value={report.values.State}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Select"
                                                options={[
                                                    { value: 'PDF', label: 'PDF' },
                                                    // { value: 'JSON', label: 'JSON' },
                                                ]}
                                                error={report.touched.State && report.errors.State}
                                            /> */}
                                            <TextInput
                                            label="State"
                                            name="State"
                                            id="State"
                                            maxLength={50}
                                            textTransform="capitalize"
                                            value={report.values.State}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter your state"
                                            error={report.touched.State && report.errors.State}
                                        />

                                            <TextInput
                                                label="PIN code"
                                                name="pincode"
                                                id="pincode"
                                                maxLength={11}
                                                value={report.values.pincode}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your pincode number"
                                                error={report.touched.pincode && report.errors.pincode}
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


                                            <DateInput
                                                label="Date of birth"
                                                name="dob"
                                                id="dob"
                                                value={report.values.dob}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your DOB"
                                                error={report.touched.dob && report.errors.dob}
                                            />

                                            <SelectInput
                                                label="ID type"
                                                name="idType"
                                                id="idType"
                                                value={report.values.idType}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Select"
                                                options={[
                                                    { value: 'PDF', label: 'PDF' },
                                                    // { value: 'JSON', label: 'JSON' },
                                                ]}
                                                error={report.touched.idType && report.errors.idType}
                                            />

                                            <TextInput
                                                label="ID value"
                                                name="panNumber"
                                                id="panNumber"
                                                maxLength={10}
                                                textTransform="uppercase"
                                                value={report.values.panNumber}
                                                onChange={report.handleChange}
                                                onBlur={report.handleBlur}
                                                placeholder="Enter your PAN number"
                                                error={report.touched.panNumber && report.errors.panNumber}
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
                    )}


                    {isReport && Object.keys(res).length > 0 && res.status == "success" && (
                        <div className="w-5xl mx-auto text-black  mt-10">
                            <ExperianReport
                                providerName="Experian"
                                applicantName={res?.data?.name}
                                mobileNumber={res?.data?.mobile}
                                panNumber={res?.data?.pan}
                                creditScore={res?.data?.credit_score}
                                onDownloadReport={handleDownload}
                                onGetNewReport={handleNewReport}
                            />
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

export default Equifax;
