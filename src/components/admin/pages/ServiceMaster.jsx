import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { FaEdit } from 'react-icons/fa';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

import {
    vendorGetServiceNameTypeList,
    vendorGetServiceTypeList,
    vendorServiceType
} from "../../services/Services_API";

export default function ServiceMaster() {
    const [servicesTypeList, setServicesTypeList] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editService, setEditService] = useState(null);

    // ----------------- Fetch Data -----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const typeRes = await vendorGetServiceTypeList({ url: "Admin/GetServiceType" });
                if (typeRes.status) setServicesTypeList(typeRes.serviceTypes);

                const serviceRes = await vendorGetServiceNameTypeList({ url: "Admin/GetServiceName" });
                if (serviceRes.status) setAllServices(serviceRes.serviceNames);

            } catch (error) {
                toast.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [openForm]);

    // ----------------- Formik -----------------
    const form = useFormik({
        initialValues: {
            service_type: "",
            service_name: "",
            description: "",
            price: "",
            api_end_point:"",
        },
        validationSchema: Yup.object({
            service_type: Yup.string().required("Service type is required"),
            service_name: Yup.string().required("Service name is required"),
            api_end_point: Yup.string().required("API end point is required"),
            price: Yup.number().typeError("Price must be a number").required("Price is required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                service_name_id: values.service_name_id,
                service_type_id: Number(values.service_type),
                service_name: values.service_name,
                api_end_point: values.api_end_point,
                description: values.description,
                price: Number(values.price),
                is_active: true,
                created_by: "admin",
                url: "Admin/AddUpdateServiceName",
            };

            try {
                const response = await vendorServiceType(payload);
                if (response.status) {
                    toast.success(editService ? "Service updated successfully" : "Service added successfully");
                    setOpenForm(false);
                    setEditService(null);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        },
    });

    // ----------------- Edit Service -----------------
    const handleEdit = (service) => {
        form.setValues({
            service_name_id: service.service_name_id,
            service_type: service.service_type_id,
            service_name: service.service_name,
            description: service.description,
            api_end_point: service.api_end_point,
            price: service.price,
        });
        setEditService(service);
        setOpenForm(true);
    };

    // ----------------- Table Columns -----------------
    const columns = [
        { name: "ID", selector: (row, i) => i + 1, width: "60px" },
        { name: "Service Type", selector: row => row.service_type },
        { name: "Service Name", selector: row => row.service_name },
        { name: "Description", selector: row => row.description },
        { name: "Price", selector: row => row.price },
        {
            name: "Action",
            cell: row => (
                <button className="px-3 py-1 text-xs" onClick={() => handleEdit(row)}>
                    <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}

                </button>
            ),
        },
    ];

    const filteredData = allServices.filter(item =>
        `${item.service_type} ${item.service_name} ${item.description} ${item.price}`
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 min-h-screen">
                <Navbar />

                <div className="p-6">
                    {/* Header + Action */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Service Master Management
                        </h2>
                        <button
                            onClick={() => {
                                form.resetForm();
                                setEditService(null);
                                setOpenForm(true);
                            }}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            + Add Service
                        </button>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search service..."
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 w-80"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        {loading && <span className="text-blue-600 font-medium">Loading...</span>}
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-lg rounded-xl p-4">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Slide-in Form */}
                {openForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                  flex items-center justify-center z-50">

                        <div className="w-[450px] bg-white shadow-2xl rounded-lg 
                    max-h-[90vh] p-6 overflow-y-auto animate-popup">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{editService ? "Edit Service" : "Add Service"}</h3>
                                <button
                                    onClick={() => setOpenForm(false)}
                                    className="text-red-500 text-xl hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={form.handleSubmit} className="grid grid-cols-1 gap-4">

                                <select
                                    name="service_type"
                                    value={form.values.service_type}
                                    onChange={form.handleChange}
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">-- Select Service Type --</option>
                                    {servicesTypeList.map(type => (
                                        <option key={type.id} value={type.service_type_id}>
                                            {type.service_type}
                                        </option>
                                    ))}
                                </select>
                                {form.touched.service_type && form.errors.service_type && (
                                    <p className="text-red-600 text-xs">{form.errors.service_type}</p>
                                )}

                                <input
                                    type="text"
                                    name="service_name"
                                    placeholder="Service Name"
                                    value={form.values.service_name}
                                    onChange={form.handleChange}
                                    readOnly={!!editService}
                                    className={`border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400
        ${editService ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                />
                                {form.touched.service_name && form.errors.service_name && (
                                    <p className="text-red-600 text-xs">{form.errors.service_name}</p>
                                )}

                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={form.values.description}
                                    onChange={form.handleChange}
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    name="api_end_point"
                                    placeholder="API end point"
                                    value={form.values.api_end_point}
                                    onChange={form.handleChange}
                                    className={`border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400
                                     ${editService ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                />
                                {form.touched.api_end_point && form.errors.api_end_point && (
                                    <p className="text-red-600 text-xs">{form.errors.api_end_point}</p>
                                )}
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={form.values.price}
                                    onChange={form.handleChange}
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                                />
                                {form.touched.price && form.errors.price && (
                                    <p className="text-red-600 text-xs">{form.errors.price}</p>
                                )}

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    {editService ? "Update Service" : "Add Service"}
                                    
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
