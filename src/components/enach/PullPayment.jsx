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
import { getBankCodeList, PullPaymentUsingEMandate } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";

function PullPayement() {
    const [loading, setLoading] = useState(false);
    const [bankCode, setBankCode] = useState([]);
    const [bankCodeDetails, setBankCodeDetails] = useState([]);

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

    // ------------------ FORM START ------------------------
    const form = useFormik({
        initialValues: {
            emandate_id: "",
            amount: "",
            // user_defined_field_1: "",
            // user_defined_field_2: "",
        },

        validationSchema: Yup.object({
            amount: Yup.number().required("Amount is required").min(1, "Amount must be atleast 10").max(2147483647, "Amount is too large"),
            emandate_id: Yup.string().required("EMandate Id is required"),
            // user_defined_field_1: Yup.string().required("User Defined Field 1 Id is required"),
            // user_defined_field_2: Yup.string().required("User Defined Field 2 Id is required"),
        }),

        onSubmit: async (values) => {

            try {
                setLoading(true);

                const payload = {
                    emandate_id: values.emandate_id,
                    amount: Number(values.amount).toFixed(2),
                    company_name: "JUNOON",
                    product_name: "JC",

                    // user_defined_field_1: values.user_defined_field_1,
                    // user_defined_field_2: values.user_defined_field_2,
                    // user_defined_field_3: "",
                    request_type: "PAYMENTCOLLECTION",

                    url: "verifiedu/PullPaymentUsingEMandate",
                };

                const response = await PullPaymentUsingEMandate(payload);
                // console.log(response);
                if (response?.data?.id) {
                    form.resetForm();
                    toast.success(response.message || response?.data?.response_meta?.description);
                } else {
                    toast.error(response.message || "Something went wrong");
                }

            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        },

    });

    //   if (loading) return <Loader message="Processing..." color="#63BB89" />;

    // ------------------ FORM END ------------------------

    return (
        <div>
            <Helmet>
                <title>Pull Payment Form</title>
            </Helmet>

            <div className="flex">
                {isOpenSidebar && <Sidebar />}
                {/* <div className="ml-64 p-6 flex-1"> */}
                <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>
                    <div className="md:w-full w-full mx-auto text-black  mt-10">
                        <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                            <h2 className="text-xl font-semibold italic text-green-600">Pull Payment Using EMandate</h2>
                            <p className="text-xs italic mb-1">Enter all required fields below</p>
                            <div className="border w-full mb-5 border-green-300 " />

                            {/* FORM */}
                            <form onSubmit={form.handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="EMandate ID"
                                        name="emandate_id"
                                        value={form.values.emandate_id}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter amount"
                                        error={form.touched.emandate_id && form.errors.emandate_id}
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

                                    {/* <TextInput
                                        label="User Defined Field 1"
                                        name="user_defined_field_1"
                                        value={form.values.user_defined_field_1}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter user_defined_field_1"
                                        error={form.touched.user_defined_field_1 && form.errors.user_defined_field_1}
                                    />
                                    
                                    <TextInput
                                        label="User Defined Field 2"
                                        name="user_defined_field_2"
                                        value={form.values.user_defined_field_2}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        placeholder="Enter user_defined_field_2"
                                        error={form.touched.user_defined_field_2 && form.errors.user_defined_field_2}
                                    /> */}
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
                </div>
            </div>
        </div>
    );
}

export default PullPayement;
