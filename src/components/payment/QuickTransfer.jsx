import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import TextInput from "../fields/TextInput";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { InitiateQuickTransfer } from "../services/Services_API";
import { useSidebar } from "../Context/SidebarContext";
import Sidebar from "../Sidebar";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";

function QuickTransfer() {
  const [loading, setLoading] = useState(false);
  const [quickTransferData, setquickTransferData] = useState(null);

  const { vendorDetails } = useContext(AuthContext);
  const { isOpenSidebar } = useSidebar();

  // Token check & redirect
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("authData"));
    if (!token?.data?.Token && !token?.data?.status) {
      window.location.href = "/login";
    }
  }, []);

  const beneficiarytypes = [
    { label: "UPI", value: "upi" },
    { label: "Bank", value: "bank_account" },
  ];
  const bankPaymentModes = [
    { label: "NEFT", value: "NEFT" },
    { label: "RTGS", value: "RTGS" },
    { label: "IMPS", value: "IMPS" },
  ];

  // ------------------ FORM START ------------------------
  const form = useFormik({
    initialValues: {
      virtual_account_number: "",
      account_number: "",
      ifsc: "",
      beneficiary_type: "",
      beneficiary_name: "",
      upi_handle: "",
      payment_mode: "",
      amount: "",
      email: "",
      phone: "",
      narration: "",
      scheduled_for: "",
      vandor_code: "",
      user_defined_field_1: "",
      user_defined_field_2: "",
      company_id: "",
      product_code: "",
    },

    validationSchema: Yup.object({
      beneficiary_name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces allowed")
        .required("Beneficiary Name is required"),

      beneficiary_type: Yup.string()
        .oneOf(["upi", "bank_account"], "Invalid beneficiary type")
        .required("Beneficiary type is required"),

      // ----------- UPI -----------
      upi_handle: Yup.string().when("beneficiary_type", {
        is: "upi",
        then: (schema) =>
          schema
            .matches(/^[\w.-]+@[\w.-]+$/, "Invalid UPI Handle")
            .required("UPI Handle is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      // ----------- BANK ----------
      account_number: Yup.string().when("beneficiary_type", {
        is: "bank_account",
        then: (schema) =>
          schema
            .matches(/^[0-9]{6,18}$/, "Invalid account number")
            .required("Account number is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      ifsc: Yup.string().when("beneficiary_type", {
        is: "bank_account",
        then: (schema) =>
          schema
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
            .required("IFSC code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      payment_mode: Yup.string().required("Payment mode is required"),

      // ----------- COMMON FIELDS ----------
      amount: Yup.number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than zero")
        .max(2147483647, "Amount is too large")
        .required("Amount is required"),

      email: Yup.string()
        .email('Invalid email')
        .test(
          'has-tld',
          'Email must include a valid domain',
          value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
        )
        .required("Email is required"),

      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      narration: Yup.string()
        .max(100, "Narration max 100 characters")
        .notRequired(),

      scheduled_for: Yup.date().nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value)
        .min(
          new Date(new Date().setDate(new Date().getDate())),
          "Scheduled date must be after today"),
      virtual_account_number: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          virtual_account_number: values.virtual_account_number,
          account_number: values.account_number,
          ifsc: values.ifsc,
          beneficiary_type: values.beneficiary_type,
          beneficiary_name: values.beneficiary_name,
          upi_handle: values.upi_handle,
          payment_mode: values.payment_mode,
          amount: Number(values.amount).toFixed(2),
          email: values.email,
          phone: values.phone,
          narration: values.narration,
          scheduled_for: values.scheduled_for,
          vandor_code: vendorDetails?.vendorcode,
          user_defined_field_1: values.user_defined_field_1,
          user_defined_field_2: values.user_defined_field_2,
          company_id: "JCP",
          product_code: "JC",
        };

        const response = await InitiateQuickTransfer(payload);
        console.log(response);
        if (response.success) {
          setLoading(false);
          form.resetForm();
          setquickTransferData(response);
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

  useEffect(() => {
    if (form.values.beneficiary_type === "upi") {
      form.setFieldValue("payment_mode", "UPI");
      form.setFieldValue("account_number", "");
      form.setFieldValue("ifsc", "");
    }

    if (form.values.beneficiary_type === "bank_account") {
      form.setFieldValue("payment_mode", "");
      form.setFieldValue("upi_handle", "");
    }
  }, [form.values.beneficiary_type]);

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
          {!quickTransferData?.success && (
            <div className="md:w-full w-full mx-auto text-black  mt-10">
              <div className="border border-green-300  md:w-2/3 mx-auto p-8 shadow-md rounded">
                <h2 className="text-xl font-semibold italic text-green-600">
                  Quick Transfer
                </h2>
                <p className="text-xs italic mb-1">
                  Enter all required fields below
                </p>
                <div className="border w-full mb-5 border-green-300 " />

                {/* FORM */}
                <form onSubmit={form.handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectInput
                      label="Beneficiary Type"
                      name="beneficiary_type"
                      value={form.values.beneficiary_type}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Select"
                      options={beneficiarytypes}
                      error={
                        form.touched.beneficiary_type &&
                        form.errors.beneficiary_type
                      }
                    />

                    {form.values.beneficiary_type === "upi" && (
                      <>
                        <TextInput
                          label="Payment Mode"
                          name="payment_mode"
                          value="UPI"
                          disabled
                        />

                        <TextInput
                          disabled={!form.values.beneficiary_type}
                          label="UPI Handle"
                          name="upi_handle"
                          value={form.values.upi_handle}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          placeholder="example@upi"
                          error={
                            form.touched.upi_handle && form.errors.upi_handle
                          }
                        />
                      </>
                    )}

                    {form.values.beneficiary_type === "bank_account" && (
                      <>
                        <SelectInput
                          label="Payment Mode"
                          name="payment_mode"
                          value={form.values.payment_mode}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          placeholder="Select Mode"
                          options={bankPaymentModes}
                          error={
                            form.touched.payment_mode &&
                            form.errors.payment_mode
                          }
                        />

                        <TextInput
                          disabled={!form.values.beneficiary_type}
                          label="Account Number"
                          name="account_number"
                          value={form.values.account_number}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          placeholder="Enter Account Number"
                          error={
                            form.touched.account_number &&
                            form.errors.account_number
                          }
                        />

                        <TextInput
                          disabled={!form.values.beneficiary_type}
                          label="IFSC Code"
                          name="ifsc"
                          value={form.values.ifsc}
                          onChange={(e) => form.setFieldValue('ifsc', e.target.value.toUpperCase())}
                          onBlur={form.handleBlur}
                          placeholder="Enter IFSC Code"
                          error={form.touched.ifsc && form.errors.ifsc}
                        />
                      </>
                    )}

                    <TextInput
                      disabled={!form.values.beneficiary_type}
                      label="Beneficiary Name"
                      name="beneficiary_name"
                      value={form.values.beneficiary_name}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter Beneficiary Name"
                      error={
                        form.touched.beneficiary_name &&
                        form.errors.beneficiary_name
                      }
                    />

                    <TextInput
                      disabled={!form.values.beneficiary_type}
                      label="Virtual Account Number"
                      name="virtual_account_number"
                      value={form.values.virtual_account_number}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter Virtual Account Number"
                      error={
                        form.touched.virtual_account_number &&
                        form.errors.virtual_account_number
                      }
                    />

                    <TextInput
                      disabled={!form.values.beneficiary_type}
                      label="Amount"
                      name="amount"
                      value={form.values.amount}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter amount"
                      error={form.touched.amount && form.errors.amount}
                    />

                    <TextInput
                      disabled={!form.values.beneficiary_type}
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
                      disabled={!form.values.beneficiary_type}
                      label="Phone"
                      name="phone"
                      maxLength={10}
                      value={form.values.phone}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter phone"
                      error={form.touched.phone && form.errors.phone}
                    />

                    <TextInput
                      disabled={!form.values.beneficiary_type}
                      label="Narration"
                      name="narration"
                      value={form.values.narration}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter narration"
                      error={form.touched.narration && form.errors.narration}
                    />

                    <DateInput
                      disabled={!form.values.beneficiary_type}
                      label="Scheduled For"
                      name="scheduled_for"
                      id="scheduled_for"
                      value={form.values.scheduled_for}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder="Enter schedule Date"
                      min={
                        new Date(Date.now() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                      error={
                        form.touched.scheduled_for && form.errors.scheduled_for
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

          {quickTransferData?.success && (
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
                        Quick Payment Details
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
                    <Info
                      label="Name"
                      value={
                        quickTransferData?.data?.transfer_request
                          ?.beneficiary_account_name
                      }
                    />
                    <Info
                      label="Unique Request Number"
                      value={
                        quickTransferData?.data?.transfer_request
                          ?.unique_request_number
                      }
                    />
                    <Info
                      label="Amount"
                      value={`₹ ${quickTransferData?.data?.transfer_request?.amount}`}
                    />
                    <Info
                      label="Status"
                      value={quickTransferData?.data?.transfer_request?.status}
                      date={quickTransferData?.data?.transfer_request?.scheduled_for}
                    />
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
const Info = ({ label, value, date }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </p>
    <p className="text-lg font-medium text-gray-800">{value || "-"} <span className="text-xs text-gray-700">{date && `(${date})`}</span></p>
  </div>
);

export default QuickTransfer;
