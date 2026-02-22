import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { CreatePaymentLinkURL } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";
import DateInput from "../fields/DateInput";

function CreatePaymentLink() {
  const [loading, setLoading] = useState(false);
  const [paymentLinkData, setpaymentLinkData] = useState(null);

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
      name: "",
      message: "",
      expiry_date:"",
      user_defined_field_1: "",
      user_defined_field_2: "",
    },

    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .max(2147483647, "Amount is too large")
        .min(1, "Minimum amount must be atleast 1"),
      email: Yup.string()
        .email('Invalid email')
        .test(
          'has-tld',
          'Email must include a valid domain',
          value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
        )
        .required("Email is required"),
      name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed")
        .required("Name is required"),
      phone: Yup.string()
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
      const formateedDate = values.expiry_date.split("-").reverse().join("-");
      try {
        setLoading(true);
        const payload = {
          email: values.email,
          name: values.name.trim(),
          amount: values.amount,
          phone: values.phone,
          message: values.message,
          vandor_code: vendorDetails?.vendorcode,
          user_defined_field_1: values.user_defined_field_1,
          user_defined_field_2: values.user_defined_field_2,
          company_id: "JCP",
          product_code: "PD456215",
          expiry_date: formateedDate,
          operation: [
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
        };

        const response = await CreatePaymentLinkURL(payload);
        console.log(response);
        if (response.status) {
          setLoading(false);
          form.resetForm();
          setpaymentLinkData(response);
        } else {
          setLoading(false);
          toast.error(response.message || response.error);
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

  //   if (loading) return <Loader message="Processing..." color="#63BB89" />;

  // ------------------ FORM END ------------------------

  return (
    <div>
      <Helmet>
        <title>Enach Form</title>
      </Helmet>

      <div className="flex">
        {isOpenSidebar && <Sidebar />}
        <div className={`${isOpenSidebar && "lg:ml-64"} md:p-6 p-2 flex-1`}>
          {!paymentLinkData?.status && (
            <div className="md:w-full w-full mx-auto text-black  mt-10">
              <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                <h2 className="text-xl font-semibold italic text-green-600">
                  Create Payment Link
                </h2>
                <p className="text-xs italic mb-1">
                  Enter all required fields below
                </p>
                <div className="border w-full mb-5 border-green-300 " />

                {/* FORM */}
                <form onSubmit={form.handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="Name"
                      name="name"
                      value={form.values.name}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter name"
                      error={form.touched.name && form.errors.name}
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
                      label="Amount"
                      name="amount"
                      value={form.values.amount}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter amount"
                      error={form.touched.amount && form.errors.amount}
                    />

                    <TextInput
                      label="Message"
                      name="message"
                      value={form.values.message}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter message"
                      error={form.touched.message && form.errors.message}
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
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold cursor-pointer"
                      disabled={loading}
                    >
                      {!loading ? "Submit" : "Submiting..."}
                    </button>

                    <button
                      type="reset"
                      onClick={form.handleReset}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 font-semibold cursor-pointer"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {paymentLinkData?.status && (
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
                        Payment Link Details
                      </h2>
                      <p className="text-sm text-gray-600">
                        Secure payment link information
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= Content ================= */}
                <div className="p-6 space-y-8">
                  {/* ===== User Info ===== */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Info label="Name" value={paymentLinkData?.data?.name} />
                    <Info label="Email" value={paymentLinkData?.data?.email} />
                    <Info
                      label="Mobile Number"
                      value={paymentLinkData?.data?.phone}
                    />
                    <Info
                      label="Amount"
                      value={`₹ ${paymentLinkData?.data?.amount}`}
                    />
                  </div>

                  <div className="text-amber-600 font-semibold">Note: Payment link will be send through email, sms or whatsapp</div>
                  {/* ===== Actions ===== */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-0">
                    <button
                      onClick={() => setpaymentLinkData(null)}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition shadow hover:shadow-md cursor-pointer"
                    >
                      Go Back
                    </button>

                    <button
                      onClick={() => handleCopy(paymentLinkData?.data?.payment_url)}
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

export default CreatePaymentLink;
