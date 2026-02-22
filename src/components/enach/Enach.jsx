import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextPassword from "../fields/TextInput";
import TextInput from "../fields/TextInput";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";
import SelectInput from "../fields/SelectInput";
import { AuthContext } from "../Context/AuthContext";
import { getBankCodeList, GetUserBankReport, GetUserEnachReport } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";
import DateInput from "../fields/DateInput";

function Enach() {
    const [loading, setLoading] = useState(false);
    const [bankCode, setBankCode] = useState([]);
    const [bankCodeDetails, setBankCodeDetails] = useState([]);
    const [enachLinkData, setEnachLinkData] = useState(null);
    const [mandateAmount, setMandateAmount] = useState("");

    const { deductAmount } = useContext(AuthContext);
    const { isOpenSidebar } = useSidebar();

    // Token check & redirect
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("authData"));
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, []);

    // Fetch bank list
    useEffect(() => {
        const fetchBankList = async () => {
            setLoading(true);
            try {
                const res = await getBankCodeList({ url: "verifiedu/BankcodeList" });
                if (res.success) {
                    setBankCode(res.data || []);
                } else {
                    toast.error(res.message || "Failed to fetch bank list");
                }
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBankList();
    }, []);

    // Fetch bank flags based on selected bank
    const handleGetBankCodeDetails = async (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        setLoading(true);
        try {
            const res = await getBankCodeList({ url: "verifiedu/BankcodeListByCode?BankCode=" + selectedId });
            if (res.success) {
                const labelMap = {
                    netbankFlag: "Net Banking",
                    adharFlag: "Aadhar",
                    cardFlag: "Card",
                    // custidFlag: "Customer ID",
                };

                const trueFlags = Object.entries(res.data)
                    .filter(([key, value]) => value === true && labelMap[key])
                    .map(([key]) => ({
                        key,
                        label: labelMap[key] || key,
                    }));

                setBankCodeDetails(trueFlags || []);
            } else {
                toast.error(res.message || "Failed to fetch bank flags");
                setBankCodeDetails([]);
            }
        } catch (err) {
            toast.error(err.message);
            setBankCodeDetails([]);
        } finally {
            setLoading(false);
        }
    };

    // ------------------ FORM START ------------------------
    const form = useFormik({
        initialValues: {
            amount: "",
            email: "",
            phone: "",
            mandate_type: "",
            account_number: "",
            confirm_account_number: "",
            account_holder_name: "",
            ifsc: "",
            account_type: "",
            mandate_frequency: "",
            bank_code: "",
            user_defined_field_1: "",
            user_defined_field_2: "",
            user_defined_field_3: "",
            message: "",
            expiry_date: "",
            final_collection_date: "",
        },

        validationSchema: Yup.object({
            amount: Yup.number().required("Amount is required").min(10, "Amount must be minimum 10").max(2147483647, "Amount is too large"),
            email: Yup.string()
                .email('Invalid email')
                .test(
                    'has-tld',
                    'Email must include a valid domain',
                    value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
                )
                .required("Email is required"),
            user_defined_field_1: Yup.string().required("user_defined_field_1 is required").min(6, "mininum chars must be 6").max(30, "maximum chars must be 30"),
            user_defined_field_2: Yup.string().required("user_defined_field_2 is required").min(6, "mininum chars must be 6").max(30, "maximum chars must be 30"),
            user_defined_field_3: Yup.string().notRequired().min(6, "mininum chars must be 6").max(30, "maximum chars must be 30"),
            // message: Yup.string().required("Message is required"),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
                .required("Phone number is required"),

            mandate_type: Yup.string().required("Mandate type is required"),
            account_number: Yup.string()
                .matches(/^[0-9]+$/, "Account number must be numeric")
                .required("Account number is required"),
            confirm_account_number: Yup.string()
                .oneOf([Yup.ref("account_number"), null], "Account numbers do not match")
                .required("Confirm account number is required"),
            account_holder_name: Yup.string()
                .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
                .required("Account holder name is required"),
            ifsc: Yup.string()
                .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
                .required("IFSC is required"),
            account_type: Yup.string().required("Account type is required"),
            mandate_frequency: Yup.string().required("Mandate frequency is required"),
            bank_code: Yup.string().required("Bank code is required"),
            expiry_date: Yup.date()
                .min(
                    new Date(new Date().setHours(0, 0, 0, 0)),
                    "Expiry date cannot be in the past"
                )
                .required("Expiry date is required"),
            final_collection_date: Yup.date()
                .min(
                    new Date(new Date().setHours(0, 0, 0, 0)),
                    "Final collection date cannot be in the past"
                )
                .test(
                    "before-expiry",
                    "Final collection date must be before expiry date",
                    function (value) {
                        const { expiry_date } = this.parent;
                        if (!value || !expiry_date) return true; // let required handle empties
                        return value < expiry_date;
                    }
                )
                .required("Final collection date is required"),
        }),

        onSubmit: async (values) => {
            const authMap = {
                netbankFlag: "NetBanking",
                adharFlag: "Aadhaar",
                cardFlag: "DebitCard",
            };

            // Correct: declare mandateType and get mapped value safely
            const mandateType = authMap[values.mandate_type] || "";

            // making date to required formate
            const formateedDate = values.expiry_date.split("-").reverse().join("-");
            const collectionFormatedDate = values.final_collection_date.split("-").reverse().join("-");

            try {
                setLoading(true);

                const payload = {
                    // success_url: `${location.origin}/success`,
                    // failure_url: `${location.origin}/failure`,
                    amount: "1.0", //
                    email: values.email, //
                    phone: values.phone, //
                    // company_name: "JUNOON",
                    company_id: "JUNOON", //
                    // product_name: "JC",
                    product_code: "JC", //
                    // mandate_type: "ENACH",
                    // account_number: values.account_number,
                    // account_holder_name: values.account_holder_name,
                    name: values.account_holder_name, //
                    // ifsc: values.ifsc,
                    // auth_mode: mandateType,   // <-- Correct value passed here
                    // account_type: values.account_type,
                    // bank_code: values.bank_code,
                    // frequency: "daily",
                    // upi_handle: "",
                    user_defined_field_1: values.user_defined_field_1, //
                    user_defined_field_2: values.user_defined_field_2, //
                    user_defined_field_3: values.user_defined_field_3, //
                    user_defined_field_4: "TXT", //
                    // request_type: "ENACH",
                    message: values.message, //
                    expiry_date: formateedDate, //
                    operation: [ //
                        {
                            type: "sms",
                            template: "Default sms template",
                        },
                        {
                            type: "email",
                            template: "Default email template",
                        },
                        {
                            type: "whatsapp",
                            template: "Default whatsapp template",
                        },
                    ],
                    is_auto_debit_link: true, //
                    is_auto_debit_seamless: true, //

                    auth_details: { //
                        max_debit_amount: values.amount,
                        final_collection_date: collectionFormatedDate,
                        auto_debit_type: "ENACH",
                        holder_account_number: values.account_number,
                        holder_account_type: values.account_type,
                        holder_bank_ifsc: values.ifsc,
                        auth_mode: mandateType,
                        amount_rule: "MAX",
                        holder_bank_code: values.bank_code,
                        frequency: values.mandate_frequency,
                    },

                    // url: "verifiedu/RegisterEMandate"
                    url: "verifiedu/CreateEMandateLink"
                };

                setMandateAmount(values.amount);

                const response = await GetUserEnachReport(payload);
                console.log(response);
                // openHTMLInSameTab(response);
                if (response.status === true) {
                    setLoading(false);
                    form.resetForm();
                    setEnachLinkData(response);

                    toast.success(response.message);
                } else {
                    setLoading(false);
                    toast.error(response?.message || response?.error);
                }

            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
        },
    });

    const handleCopy = (txt) => {
        navigator.clipboard.writeText(txt)
        toast.success("Payment link copied")
    }

    const openHTMLInSameTab = (html) => {
        document.open();
        document.write(html);
        document.close();
    };

    //   if (loading) return <Loader message="Processing..." color="#63BB89" />;

    // ------------------ FORM END ------------------------

    return (
        <div>
            <Helmet>
                <title>Enach Form</title>
            </Helmet>

            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                {/* <div className="ml-64 p-6 flex-1"> */}
                <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>

                    {!enachLinkData?.status && (
                        <div className="md:w-full w-full mx-auto text-black  mt-2">
                            <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                                <h2 className="text-xl font-semibold italic text-green-600">User Enach Link</h2>
                                <p className="text-xs italic mb-1">Enter all required fields below</p>
                                <div className="border w-full mb-5 border-green-300 " />

                                {/* FORM */}
                                <form onSubmit={form.handleSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextInput
                                            label="Amount"
                                            name="amount"
                                            value={form.values.amount}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter amount"
                                            error={form.touched.amount && form.errors.amount}
                                        />

                                        <TextInput
                                            label="Email"
                                            name="email"
                                            value={form.values.email}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter email"
                                            maxLength={35}
                                            error={form.touched.email && form.errors.email}
                                        />

                                        <TextInput
                                            label="Phone"
                                            name="phone"
                                            maxLength={10}
                                            value={form.values.phone}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter phone"
                                            error={form.touched.phone && form.errors.phone}
                                        />

                                        {/* Bank Dropdown */}
                                        <SelectInput
                                            label="Select Bank"
                                            name="bank_code"
                                            id="bank_code"
                                            value={form.values.bank_code}
                                            onChange={(e) => {
                                                form.handleChange(e);
                                                form.setFieldValue("mandate_type", ""); // reset second dropdown
                                                handleGetBankCodeDetails(e);
                                            }}
                                            onBlur={form.handleBlur}
                                            placeholder="Select Bank"
                                            options={bankCode?.map((item) => ({
                                                value: item.bankId,
                                                label: item.bankName,
                                            }))}
                                            error={form.touched.bank_code && form.errors.bank_code}
                                        />

                                        <TextInput
                                            label="Account Holder Name"
                                            name="account_holder_name"
                                            value={form.values.account_holder_name}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Account holder name"
                                            error={form.touched.account_holder_name && form.errors.account_holder_name}
                                        />

                                        <TextInput
                                            label="IFSC"
                                            name="ifsc"
                                            value={form.values.ifsc}
                                            onChange={(e) => form.setFieldValue('ifsc', e.target.value.toUpperCase())}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter IFSC"
                                            error={form.touched.ifsc && form.errors.ifsc}
                                        />

                                        <TextInput
                                            label="Account Number"
                                            name="account_number"
                                            type="password"
                                            value={form.values.account_number}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter account number"
                                            error={form.touched.account_number && form.errors.account_number}
                                        />

                                        <TextPassword
                                            label="Confirm Account Number"
                                            name="confirm_account_number"
                                            value={form.values.confirm_account_number}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Confirm account number"
                                            error={form.touched.confirm_account_number && form.errors.confirm_account_number}
                                        // disabled={!form.values.account_number} // enable only after Account Number
                                        />

                                        <SelectInput
                                            label="Account Type"
                                            name="account_type"
                                            id="account_type"
                                            value={form.values.account_type}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Select"
                                            options={[
                                                { value: 'SAVINGS', label: 'Savings' },
                                                { value: 'CURRENT', label: 'Current' },
                                            ]}
                                            error={form.touched.account_type && form.errors.account_type}
                                        />

                                        {/* Mandate Type Dropdown (Disabled until bank selected) */}
                                        <SelectInput
                                            label="Select Mandate Type"
                                            name="mandate_type"
                                            id="mandate_type"
                                            value={form.values.mandate_type}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Select Mandate Type"
                                            options={bankCodeDetails?.map((item) => ({
                                                value: item.key,
                                                label: item.label,
                                            }))}
                                            error={form.touched.mandate_type && form.errors.mandate_type}
                                            disabled={!form.values.bank_code || loading}
                                        />

                                        <SelectInput
                                            label="Mandate Frequency"
                                            name="mandate_frequency"
                                            id="mandate_frequency"
                                            value={form.values.mandate_frequency}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Select Mandate Frequency"
                                            options={[
                                                { value: 'DAILY', label: 'Daily' },
                                                { value: 'WEEKLY', label: 'Weekly' },
                                                { value: 'MONTHLY', label: 'Monthly' },
                                                { value: 'QUARTERLY', label: 'Quarterly' },
                                                { value: 'YEARLY', label: 'Yearly' },
                                                { value: 'BIMONTHLY', label: 'Bimonthly' },
                                                { value: 'HALFYEARLY', label: 'Half-Yearly' },
                                                { value: 'AS_PRESENTED', label: 'As Presented' },
                                            ]}
                                            error={form.touched.mandate_frequency && form.errors.mandate_frequency}
                                        />

                                        <TextInput
                                            label="User Defined Field 1"
                                            name="user_defined_field_1"
                                            maxLength={30}
                                            value={form.values.user_defined_field_1}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter User Defined Field 1"
                                            error={form.touched.user_defined_field_1 && form.errors.user_defined_field_1}
                                        />

                                        <TextInput
                                            label="User Defined Field 2"
                                            name="user_defined_field_2"
                                            maxLength={30}
                                            value={form.values.user_defined_field_2}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter User Defined Field 2"
                                            error={form.touched.user_defined_field_2 && form.errors.user_defined_field_2}
                                        />

                                        <TextInput
                                            label="User Defined Field 3"
                                            name="user_defined_field_3"
                                            maxLength={30}
                                            value={form.values.user_defined_field_3}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter User Defined Field 3"
                                            error={form.touched.user_defined_field_3 && form.errors.user_defined_field_3}
                                        />

                                        <TextInput
                                            label="Message"
                                            name="message"
                                            maxLength={30}
                                            value={form.values.message}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter message"
                                            error={form.touched.message && form.errors.message}
                                        />

                                        <DateInput
                                            label="First Collection Date"
                                            name="final_collection_date"
                                            id="final_collection_date"
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]} // 👈 blocks past dates
                                            value={form.values.final_collection_date}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter your final collection date"
                                            error={
                                                form.touched.final_collection_date && form.errors.final_collection_date
                                            }
                                        />

                                        <DateInput
                                            label="Collection Expiry Date"
                                            name="expiry_date"
                                            id="expiry_date"
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]} // 👈 blocks past dates
                                            value={form.values.expiry_date}
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            placeholder="Enter expiry_date"
                                            error={
                                                form.touched.expiry_date && form.errors.expiry_date
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-4 items-center justify-center my-5">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold"
                                        >
                                            Submit
                                        </button>

                                        <button
                                            type="reset"
                                            onClick={form.handleReset}
                                            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 font-semibold"
                                        >
                                            Reset Form
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {enachLinkData?.status && (
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
                                                Enach Link Details
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                Secure enach link information
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ================= Content ================= */}
                                <div className="p-6 space-y-8">
                                    {/* ===== User Info ===== */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Info label="Name" value={enachLinkData?.data?.name} />
                                        <Info label="Email" value={enachLinkData?.data?.email} />
                                        <Info
                                            label="Mobile Number"
                                            value={enachLinkData?.data?.phone}
                                        />
                                        <Info
                                            label="Mandate Amount"
                                            value={`₹ ${mandateAmount}`}
                                        />
                                    </div>

                                    <div className="text-amber-600 font-semibold">Note: Payment link will be send through email, sms or whatsapp</div>
                                    {/* ===== Actions ===== */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-0">
                                        <button
                                            onClick={() => setEnachLinkData(null)}
                                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md cursor-pointer"
                                        >
                                            Go Back
                                        </button>

                                        <button
                                            onClick={() => handleCopy(enachLinkData?.data?.payment_url)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md hover:cursor-pointer"
                                        >
                                            Copy Payment Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
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

export default Enach;
