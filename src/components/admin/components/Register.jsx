import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { vendorRegistration } from "../../services/Services_API";
import { toast } from "react-toastify";

const generatePassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const Register = ({ cancelClose, userUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [res, setRes] = useState({});
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      companyName: "",
      panNumber: "",
      gender: "",
      mobile: "",
      officeLandline: "",
      vendortype: "",
      // password: generatePassword(),
      address: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      officeAddress: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      isActive: true,
    },

    validationSchema: Yup.object({
      firstName: Yup.string().matches(/^[A-Za-z]+$/, "Only alphabets are allowed").required("First name is required"),
      lastName: Yup.string().matches(/^[A-Za-z]+$/, "Only alphabets are allowed").required("Last name is required"),
      email: Yup.string()
        .email('Invalid email')
        .test(
          'has-tld',
          'Email must include a valid domain',
          value => value ? /\.[a-zA-Z]{2,}$/.test(value) : false
        )
        .required("Email is required"),
      username: Yup.string().required("Username is required").min(4,"Username must be at least 4 characters"),
      companyName: Yup.string().required("Company name is required"),
      panNumber: Yup.string().required('PAN Number is required'),
      gender: Yup.string().required("Gender is required"),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid mobile number')
        .required('Mobile number is required'),
      officeLandline: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
        .required("Office landline is required"),
      vendortype: Yup.string().required("Vendor type is required"),
      address: Yup.object({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zipCode: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Zip code is required"),
      }),
      officeAddress: Yup.object({
        address: Yup.string().required("Office address is required"),
        city: Yup.string().required("Office city is required"),
        state: Yup.string().required("Office state is required"),
        zipCode: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Office zip code is required"),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          id: values.id,
          vendorFirstName: values.firstName,
          vendorLastName: values.lastName,
          vendorEmail: values.email,
          vendorCompanyName: values.companyName,
          // password: values.password,
          userName: values.username,
          panNumber: values.panNumber,
          gender: values.gender,
          mobile: values.mobile,
          officeLandline: values.officeLandline,
          vendortype: values.vendortype,
          addressLine: values.address.address,
          city: values.address.city,
          state: values.address.state,
          zipCode: values.address.zipCode,
          officeAddressLine: values.officeAddress.address,
          officeCity: values.officeAddress.city,
          officeState: values.officeAddress.state,
          officeZipCode: values.officeAddress.zipCode,
          createdBy: "Admin"
        }
        const respose = await vendorRegistration(payload);

        if (respose.status) {
          setLoading(false);
          setRes(respose);
          setIsReport(true);
          formik.resetForm();
          toast.success(respose.message);
          cancelClose();
        } else {
          setIsReport(false);
          setLoading(false);
          setRes({});
          toast.error(respose.message);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
        setIsReport(false);
        setRes({});
      } finally {
        toast.error(error.message || "Something went wrong");
        setLoading(false);
      }
      // alert("✅ User Registered!\n" + JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    if (userUpdate) {

      formik.setValues({
        id: userUpdate.id,
        firstName: userUpdate.vendorfirstname,
        lastName: userUpdate.vendorlastname || "",
        email: userUpdate.vendoremail || "",
        username: userUpdate.username || "",
        companyName: userUpdate.companyname || "",
        gender: userUpdate.gender || "",
        panNumber: userUpdate.pannumber || "",
        mobile: userUpdate.mobile || "",
        officeLandline: userUpdate.officelandline || "",
        vendortype: userUpdate.vendortype || "",
        address: {
          address: userUpdate.address || "",
          city: userUpdate.city || "",
          state: userUpdate.state || "",
          zipCode: userUpdate.zipcode || "",
        },
        officeAddress: {
          address: userUpdate.officeaddress || "",
          city: userUpdate.officecity || "",
          state: userUpdate.officestate || "",
          zipCode: userUpdate.officezipcode || "",
        },
        isActive: true,
      });
      formik.setTouched({});
    }
  }, [userUpdate]);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Background Overlay + Blur */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl 
                  w-full max-w-3xl max-h-[90vh] overflow-y-auto 
                  p-8 animate-popup">

        {/* Close Button */}
        <button
          onClick={cancelClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 
                 hover:rotate-90 transition-all text-2xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 tracking-wide">
          Vendor Registration
        </h2>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FIRST NAME */}
          <div>
            <label className="text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              // maxLength="50"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
            )}
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              // maxLength="50"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
            )}
          </div>

          {/* EMAIL — full width */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              maxLength={35}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              readOnly = {userUpdate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500 ${userUpdate && 'bg-gray-50'}`}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            )}
          </div>

          {/* COMPANY */}
          <div>
            <label className="text-gray-700 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyName}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.companyName && formik.errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.companyName}</p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <label className="text-gray-700 font-medium">PAN</label>
            <input
              type="text"
              name="panNumber"
              maxLength={10}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.panNumber.toUpperCase()}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.panNumber && formik.errors.panNumber && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.panNumber}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700 font-medium">Gender</label>
            <select
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
            )}
          </div>

          {/* MOBILE */}
          <div>
            <label className="text-gray-700 font-medium">Mobile</label>
            <input
              type="text"
              name="mobile"
              maxLength="10"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                     focus:ring-2 focus:ring-blue-500"

            />
            {formik.touched.mobile && formik.errors.mobile && (
              <p className="text-red-500 text-sm">{formik.errors.mobile}</p>
            )}
          </div>

          {/* OFFICE LANDLINE */}
          <div>
            <label className="text-gray-700 font-medium">Office Landline</label>
            <input
              type="text"
              name="officeLandline"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.officeLandline}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                     focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.officeLandline && formik.errors.officeLandline && (
              <p className="text-red-500 text-sm">{formik.errors.officeLandline}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 font-medium">Vendor Type</label>
            <select
              name="vendortype"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.vendortype}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 
                     bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Vendor Type</option>
              <option>Api_Vendor</option>
              <option>Service_Vendor</option>
              <option>LMS_Vendor</option>
            </select>
            {formik.touched.vendortype && formik.errors.vendortype && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.vendortype}</p>
            )}
          </div>

          {/* HOME ADDRESS - TITLE */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Home Address</h3>
          </div>

          {/* HOME ADDRESS FIELDS */}
          {["address", "city", "state", "zipCode"].map((field) => (
            <div key={field}>
              <label className="text-gray-700 font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <input
                name={`address.${field}`}
                value={formik.values.address[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.address?.[field] &&
                formik.errors.address?.[field] && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.address[field]}
                  </p>
                )}
            </div>
          ))}

          {/* OFFICE ADDRESS TITLE */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Office Address</h3>
          </div>

          {/* OFFICE ADDRESS FIELDS */}
          {["address", "city", "state", "zipCode"].map((field) => (
            <div key={field}>
              <label className="text-gray-700 font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <input
                name={`officeAddress.${field}`}
                value={formik.values.officeAddress[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.officeAddress?.[field] &&
                formik.errors.officeAddress?.[field] && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.officeAddress[field]}
                  </p>
                )}
            </div>
          ))}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg mt-6 
                   font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>

    </div>

  );
};

export default Register;
