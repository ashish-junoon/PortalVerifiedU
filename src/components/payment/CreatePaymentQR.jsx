import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import {
  CreatePaymentLinkURL,
  CreatePaymentQRLink,
} from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";
import DateInput from "../fields/DateInput";

function CreatePaymentQR() {
  const [loading, setLoading] = useState(false);
  const [paymentQRData, setpaymentQRData] = useState(null);

  const { vendorDetails } = useContext(AuthContext);
  const { isOpenSidebar } = useSidebar();

  // Token check & redirect
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("authData"));
    if (!token?.data?.Token && !token?.data?.status) {
      window.location.href = "/login";
    }
  }, []);

    // copy helper function
    const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt)
    toast.success("Payment QR copied")
  }

  // ------------------ FORM START ------------------------
  const form = useFormik({
    initialValues: {
      amount: "",
      per_transaction_amount: "",
      customer_name: "",
      customer_phone: "",
      expiry_date: "",
      user_defined_field_1: "",
      user_defined_field_2: "",
      customer_email: "",
    },

    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .max(2147483647, "Amount is too large"),
      per_transaction_amount: Yup.number()
        .required("Amount is required")
        .min(1)
        .max(2147483647, "Amount is too large"),
      customer_email: Yup.string()
              .email('Invalid email')
              .test(
                'has-tld',
                'Email must include a valid domain',
                value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
              )
              .required("Email is required"),
      customer_name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
        .required("First name is required"),
      customer_phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone number is required"),
      expiry_date: Yup.date()
        .min(
          new Date(new Date().setHours(0, 0, 0, 0)),
          "Expiry date cannot be in the past"
        )
        .required("Expiry date is required"),
    }),

    onSubmit: async (values) => {
      const formattedDate = values.expiry_date + " 23:59:59";
      try {
        setLoading(true);
        const payload = {
          amount: Number(values.amount).toFixed(2),
          per_transaction_amount: Number(values.per_transaction_amount).toFixed(
            2
          ),
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          notification_cycle_type: "daily",
          expiry_date: formattedDate,
          vandor_code: vendorDetails?.vendorcode,
          customer_email: values.customer_email,
          user_defined_field_1: values.user_defined_field_1,
          user_defined_field_2: values.user_defined_field_2,
          company_id: "JCP",
          product_code: "PD456215",
        };

        const response = await CreatePaymentQRLink(payload);
        console.log(response);
        if (response.success) {
          setLoading(false);
          form.resetForm();
          setpaymentQRData(response);
        } else {
          setLoading(false);
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    },
  });

  //   if (loading) return <Loader message="Processing..." color="#63BB89" />;

  // ------------------ FORM END ------------------------
  console.log(paymentQRData);

  return (
    <div>
      <Helmet>
        <title>Enach Form</title>
      </Helmet>

      <div className="flex">
        {isOpenSidebar && <Sidebar />}
        <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>
          {!paymentQRData?.success && (
            <div className="md:w-full w-full mx-auto text-black  mt-10">
              <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                <h2 className="text-xl font-semibold italic text-green-600">
                  Create Payment QR
                </h2>
                <p className="text-xs italic mb-1">
                  Enter all required fields below
                </p>
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
                      label="Per Transaction Amount"
                      name="per_transaction_amount"
                      value={form.values.per_transaction_amount}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter per transaction amount"
                      error={
                        form.touched.per_transaction_amount &&
                        form.errors.per_transaction_amount
                      }
                    />

                    <TextInput
                      label="Customer Name"
                      name="customer_name"
                      value={form.values.customer_name}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter Customer Name"
                      error={
                        form.touched.customer_name && form.errors.customer_name
                      }
                    />

                    <TextInput
                      label="Customer Phone"
                      name="customer_phone"
                      value={form.values.customer_phone}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter Customer Name"
                      error={
                        form.touched.customer_phone &&
                        form.errors.customer_phone
                      }
                    />

                    <TextInput
                      label="Customer Email"
                      name="customer_email"
                      value={form.values.customer_email}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter customer_email"
                      maxLength={35}
                      error={
                        form.touched.customer_email &&
                        form.errors.customer_email
                      }
                    />

                    <DateInput
                      label="Expiry Date"
                      name="expiry_date"
                      id="expiry_date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]} // 👈 blocks past dates
                      value={form.values.expiry_date}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter your expiry_date"
                      error={
                        form.touched.expiry_date && form.errors.expiry_date
                      }
                    />
                  </div>

                  <div className="flex gap-4 items-center justify-center my-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold"
                    >
                      {loading ? "Submiting..." : "Submit"}
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

          {paymentQRData?.success && (
            <div className="md:w-full w-full mx-auto text-black">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* ================= Header ================= */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        QR Payment Details
                      </h2>
                      <p className="text-sm text-gray-600">Scan QR to pay</p>
                    </div>
                  </div>
                </div>

                {/* ================= Content ================= */}
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* ===== LEFT : User Info ===== */}
                    <div className="lg:col-span-2 space-y-6 h-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info
                          label="Name"
                          value={
                            paymentQRData?.data?.transaction_order
                              ?.customer_name
                          }
                        />
                        <Info
                          label="Email"
                          value={
                            paymentQRData?.data?.transaction_order
                              ?.customer_email
                          }
                        />
                        <Info
                          label="Mobile Number"
                          value={
                            paymentQRData?.data?.transaction_order
                              ?.customer_phone
                          }
                        />
                        <Info
                          label="Amount"
                          value={`₹ ${paymentQRData?.data?.transaction_order?.amount}`}
                        />
                      </div>

                  <div className="text-amber-600 font-semibold">Note: Payment QR will be send through email, sms or whatsapp</div>
                      {/* ===== Actions ===== */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-0">
                        <button
                          onClick={() => setpaymentQRData(null)}
                          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md cursor-pointer"
                        >
                          Go Back
                        </button>
                        <button
                          onClick={() => handleCopy(paymentQRData?.data?.transaction_order
                              ?.upi_qrcode_remote_file_location)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md"
                        >
                          Copy QR link
                        </button>
                      </div>
                    </div>

                    {/* ===== RIGHT : QR CODE ===== */}
                    <div className="flex flex-col items-center justify-start border border-gray-200 rounded-xl p-2 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Scan & Pay
                      </p>

                      <img
                        src={
                          paymentQRData?.data?.transaction_order
                            ?.upi_qrcode_remote_file_location
                        }
                        alt="UPI QR Code"
                        className="w-44 h-44 object-contain rounded-lg shadow-sm"
                      />

                      <p className="text-sm text-gray-600 mt-3 text-center">
                        UPI ID
                      </p>
                      <p className="font-semibold text-gray-800 text-center break-all">
                        {
                          paymentQRData?.data?.transaction_order
                            ?.primary_upi_handle
                        }
                      </p>
                      <p>Per Transaction Amount: ₹{paymentQRData?.data?.transaction_order?.per_transaction_amount}</p>
                    </div>
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

export default CreatePaymentQR;
