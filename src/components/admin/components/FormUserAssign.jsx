import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { vendorAssingService } from "../../services/Services_API";
const FormUserAssign = ({ user = [], servicesTypeList = [], servicesList = [], cancelClose, editService }) => {

    const [loading, setLoading] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [res, setRes] = useState({});
    const [list, setList] = useState([]);
    const [price, setPrice] = useState([]);
    const handleServiceTypeChange = (e) => {
        const selectedId = e.target.value;
        const filteredNames = servicesList.filter(
            (item) => item.service_type_id === Number(selectedId)
        );

        setList(filteredNames);
    }
    const handleServiceprice = (e) => {
    const selectedId = Number(e.target.value);

    const service = servicesList.find(
        (item) => item.service_name_id === selectedId
    );

    if (service) {
        report.setFieldValue("price", service.price); // only update price
    }
};
    const report = useFormik({
        initialValues: {
            user: "",
            service: "",
            price: "",
            service_type: "",
        },
        validationSchema: Yup.object({
            user: Yup.string().required("User is required"),
            service_type: Yup.string().required("Service type is required"),
            service: Yup.string().required("Service name is required"),
            price: Yup.string().required("Price is required"),
        }),
        onSubmit: async (values) => {

            try {
                setLoading(true);
                const payload = {
                    ServiceID: values.ServiceID,
                    VendorCode: values.user,
                    service_type_id: values.service_type,
                    service_name_id: values.service,
                    ServiceAmount: values.price,
                    IsActive: true,
                    createdBy: "Admin"
                }
                const respose = await vendorAssingService(payload);
                if (respose.Status) {
                    setLoading(false);
                    setRes(respose);
                    setIsReport(true);
                    report.resetForm();
                    cancelClose();
                    toast.success(respose.Message);
                } else {
                    setIsReport(false);
                    setLoading(false);
                    setRes({});
                    toast.error(respose.Message);
                }
            } catch (error) {
                toast.error(error.Message);
                setLoading(false);
                setIsReport(false);
                setRes({});
            } finally {
                // toast.error(error.Message || "Something went wrong");
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (!editService) return;
        console.log(editService)
        // 1. Find service type ID
        const type = servicesTypeList.find(
            x => x.service_type === editService.service_type
        );

        // 2. Find service name ID
        const service = servicesList.find(
            x => x.service_name === editService.service_name
        );

        // 3. Filter service list for dropdown
        const filtered = servicesList.filter(
            i => i.service_type_id === type?.service_type_id
        );
        setList(filtered);

        // 4. Set values in formik
        report.setValues({
            ServiceID: editService.ServiceID,
            user: editService.vendor_code,
            service_type: type?.service_type_id ?? "",
            service: service?.service_name_id ?? "",
            price: editService.price
        });

    }, [editService]);

    return (
        <div className="p-8 mt-10 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                User Assign Service
            </h1>

            {/* Form */}
            <form
                onSubmit={report.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >

                {/* Select User */}
                <div>
                    <label className="block text-gray-700 mb-1">Select User</label>
                    <select
                        name="user"
                        value={report.values.user}
                        onChange={report.handleChange}
                        onBlur={report.handleBlur}
                        className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${report.touched.user && report.errors.user ? "border-red-500" : ""
                            }`}
                    >
                        <option value="">-- Select User --</option>
                        {user.map((opt, idx) => (
                            <option key={idx} value={opt.vendorcode}>
                                {opt.username}
                            </option>
                        ))}
                    </select>
                    {report.touched.user && report.errors.user && (
                        <p className="text-red-600 text-xs">{report.errors.user}</p>
                    )}
                </div>

                {/* Service Type */}
                <div>
                    <label className="block text-gray-700 mb-1">Service Type</label>
                    <select
                        name="service_type"
                        value={report.values.service_type}
                        onChange={(e) => {
                            report.handleChange(e);      // updates Formik state
                            handleServiceTypeChange(e);  // updates filtered list
                        }}
                        onBlur={report.handleBlur}
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select Service Type --</option>
                        {servicesTypeList.map((service, id) => (
                            <option key={id} value={service.service_type_id}>
                                {service.service_type}
                            </option>
                        ))}
                    </select>


                    {report.touched.service_type && report.errors.service_type && (
                        <p className="text-red-600 text-xs">{report.errors.service_type}</p>
                    )}
                </div>

                {/* Service Name */}
                <div>
                    <label className="block text-gray-700 mb-1">Select Service</label>
                    <select
                        name="service"
                        value={report.values.service}
                        onChange={(e) => {
                            report.handleChange(e);      // updates Formik state
                            handleServiceprice(e);  // updates filtered list
                        }}
                        onBlur={report.handleBlur}
                        className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${report.touched.service && report.errors.service ? "border-red-500" : ""
                            }`}
                    >
                        <option value="">-- Select Service --</option>
                        {list.map((item, idx) => (
                            <option key={idx} value={item.service_name_id}>
                                {item.service_name}
                            </option>
                        ))}
                    </select>
                    {report.touched.service && report.errors.service && (
                        <p className="text-red-600 text-xs">{report.errors.service}</p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-gray-700 mb-1">Price</label>
                    <input
                        type="text"
                        name="price"
                        value={report.values.price}
                        onChange={report.handleChange}
                        onBlur={report.handleBlur}
                        placeholder="Enter service price"
                        className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${report.touched.price && report.errors.price ? "border-red-500" : ""
                            }`}
                    />
                    {report.touched.price && report.errors.price && (
                        <p className="text-red-600 text-xs">{report.errors.price}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {loading? "Submiting...": "Submit"}
                </button>
            </form>
        </div>

    );
};

export default FormUserAssign;
