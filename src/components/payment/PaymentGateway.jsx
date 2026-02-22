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
import { getBankCodeList, GetUserBankReport, GetUserEnachReport, vendorPayment } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";

function PaymentGateway() {

    const [loading, setLoading] = useState(false);

    const { vendorDetails } = useContext(AuthContext);
    const { isOpenSidebar } = useSidebar();

    // Token check & redirect
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("authData"));
        if (!token?.data?.Token && !token?.data?.status) {
            window.location.href = "/login";
        }
    }, []);

    // ------------------ FORM START ------------------------
    const form = useFormik({
        initialValues: {
            amount: "",
            email: "",
            phone: "",
            firstname: "",
            productinfo: ""
        },

        validationSchema: Yup.object({
            amount: Yup.number().required("Amount is required").max(2147483647, "Amount is too large"),
            email: Yup.string()
                .email('Invalid email')
                .test(
                    'has-tld',
                    'Email must include a valid domain',
                    value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
                )
                .required("Email is required"),
            firstname: Yup.string().matches(/^[A-Za-z]+$/, "Only alphabets are allowed").required("First name is required"),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
                .required("Phone number is required"),
            productinfo: Yup.string().required("productinfo is Required")
        }),

        onSubmit: async (values) => {

            try {
                setLoading(true);

                const payload = {
                    amount: values.amount,
                    email: values.email,
                    phone: values.phone,
                    firstname: values.firstname,
                    productinfo: values.productinfo,
                    success_url: `${window.location.origin}/success`,
                    failed_url: `${window.location.origin}/failure`,

                    company_name: "JUNOON",
                    product_name: "JC",
                    user_defined_field_1: "",
                    user_defined_field_2: "",
                    user_defined_field_3: "",
                    user_defined_field_6: vendorDetails?.vendorcode
                };

                const response = await vendorPayment(payload);
                console.log(response);
                if (response.status) {
                    window.open(response.data, "_self");
                    setLoading(false);
                    form.resetForm();
                } else {
                    setLoading(false);
                    toast.error(response.message || response.error_desc);
                }

            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
        },

    });


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
                    <div className="md:w-full w-full mx-auto text-black  mt-10">
                        <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                            <h2 className="text-xl font-semibold italic text-green-600">Payment Gateway</h2>
                            <p className="text-xs italic mb-1">Enter all required fields below</p>
                            <div className="border w-full mb-5 border-green-300 " />

                            {/* FORM */}
                            <form onSubmit={form.handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="First Name"
                                        name="firstname"
                                        value={form.values.firstname}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter firstName"
                                        error={form.touched.firstname && form.errors.firstname}
                                    />

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
                                        maxLength={35}
                                        value={form.values.email}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter email"
                                        error={form.touched.email && form.errors.email}
                                    />

                                    <TextInput
                                        label="Phone"
                                        name="phone"
                                        value={form.values.phone}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter phone"
                                        maxLength={10}
                                        error={form.touched.phone && form.errors.phone}
                                    />

                                    <TextInput
                                        label="Product Info"
                                        name="productinfo"
                                        value={form.values.productinfo}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter product Info"
                                        error={form.touched.productinfo && form.errors.productinfo}
                                    />

                                </div>

                                <div className="flex gap-4 items-center justify-center my-5">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold"
                                    >
                                        {loading?"Submiting...":"Submit"}
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
                </div>
            </div>
        </div>
    );
}

export default PaymentGateway;
