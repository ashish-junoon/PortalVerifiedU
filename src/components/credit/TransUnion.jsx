import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import Loader from "../utils/Loader";
import { GetTUReport } from "../services/Services_API";
import ExperianReport from "./ExperianReport";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import { useSidebar } from "../Context/SidebarContext";

function TransUnion() {
    const {isOpenSidebar} = useSidebar()
    const { updateWallet } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});

    const token = JSON.parse(localStorage.getItem('authData'));

    useEffect(() => {
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, [token]);

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




   const handleDownload = () => {
    if (res?.data?.htmlUrl) {
        const link = document.createElement("a");
        link.href = res.data.htmlUrl;
        link.setAttribute("download", "cibil_report.pdf");
        link.setAttribute("target", "_blank");

        document.body.appendChild(link);
        link.click();
        link.remove();
    } else {
        toast.error("No download link available");
    }
};

    const handleNewReport = () => {
        setLoading(false);
        setRes({});
        setIsReport(false);
        report.resetForm();
    };

    const report = useFormik({
        initialValues: {
            fullName: '',
            lastName: '',
            mobile: '',
            panNumber: '',
            Address: '',
            city: '',
            state: '',
            pin: '',
            dob: '',
            gender: '',
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
            gender: Yup.string().required('Gender is required'),
        }),
        onSubmit: async (values) => {

            const payload = {
                customerInfo: {
                    name: {
                        forename: values.fullName,
                        surname: values.lastName,
                    },
                    identificationNumber: {
                        identifierName: values.panNumber.toUpperCase()
                    },
                    address: {
                        streetAddress: values.Address,
                        city: values.city,
                        postalCode: parseInt(values.pin),
                        state: values.state
                    },
                    emailID: "abc@gmail.com",
                    dateOfBirth: values.dob,
                    phoneNumber: {
                        number: values.mobile
                    },
                    gender: values.gender
                }
            }
            try {
                setLoading(true);
                const response = await GetTUReport(payload);
                if (response?.status === 'success') {
                    setRes(response);
                    setIsReport(true);
                } else {
                    toast.error(response?.message || response?.error_message || "Failed to get report.");
                    setRes(response);
                    setIsReport(true);
                }
            } catch (error) {
                toast.error("Something went wrong while fetching report.");
            } finally {
                setLoading(false);
            }
            updateWallet();
        },
    });

    const borrowerName = res?.data?.cibilData?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess?.Asset?.TrueLinkCreditReport?.Borrower?.BorrowerName?.Name.Forename;

    const riskScore = res?.data?.cibilData?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess?.Asset?.TrueLinkCreditReport?.Borrower?.CreditScore?.riskScore;

    const identifiers = res?.data?.cibilData?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess?.Asset?.TrueLinkCreditReport?.Borrower?.IdentifierPartition?.Identifier[1].ID.Id;

    if (loading) return <Loader message="Getting Report..." color="#63BB89" />;

    return (
        <div>
            <Helmet>
                <title>VerifiedU</title>
            </Helmet>
            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>
                    {!isReport && Object.keys(res).length === 0 && (
                        <div className="md:w-full mx-auto text-black  mt-2">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-4 md:p-8 shadow-md rounded">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold italic text-green-600">TransUnion</h2>
                                    <p className="text-xs italic mb-1">TransUnion Credit Bureau</p>
                                    <div className="border w-full border-green-300 " />
                                </div>

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
                                            error={report.touched.panNumber && report.errors.panNumber}
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
                                            max={new Date().toISOString().split('T')[0]}
                                            value={report.values.dob}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Enter your DOB"
                                            error={report.touched.dob && report.errors.dob}
                                        />

                                        <SelectInput
                                            label="Gender"
                                            name="gender"
                                            id="gender"
                                            value={report.values.gender}
                                            onChange={report.handleChange}
                                            onBlur={report.handleBlur}
                                            placeholder="Select"
                                            options={[
                                                { value: 'Male', label: 'Male' },
                                                { value: 'Female', label: 'Female' },
                                            ]}
                                            error={report.touched.gender && report.errors.gender}
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
                            </div>
                        </div>
                    )}

                    {isReport && res?.status === "success" && (
                        <div className="w-full mx-auto text-black  mt-10">
                            <ExperianReport
                                providerName="TransUnion"
                                applicantName={borrowerName}
                                mobileNumber={report.values.mobile}
                                panNumber={identifiers}
                                creditScore={riskScore}
                                onDownloadReport={handleDownload}
                                onGetNewReport={handleNewReport}
                            />
                        </div>
                    )}

                    {isReport && res?.status === "error" && (
                        <div className="w-full mx-auto text-black  mt-10 text-center">
                            <p className="text-red-600 font-semibold">{res.message || "An error occurred"}</p>
                            <p>Please try again</p>
                            <button
                                onClick={handleNewReport}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out    "
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransUnion;
