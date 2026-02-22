import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { FaEdit } from 'react-icons/fa';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MdEdit } from 'react-icons/md';
import { vendorGetServiceTypeList, vendorServiceType } from "../../services/Services_API";

export default function ServiceTypeMaster() {
    const [services, setServices] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editService, setEditService] = useState(null);

    // Fetch services
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await vendorGetServiceTypeList({ url: "Admin/GetServiceType" });
                if (res.status) setServices(res.serviceTypes);
                else toast.error(res.message);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [openForm]);

    // Formik
    const form = useFormik({
        initialValues: {
            service_type: "",
            description: "",
            id: "",
        },
        validationSchema: Yup.object({
            service_type: Yup.string().required("Service type is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                service_type_id: values.service_type_id,
                service_type: values.service_type,
                description: values.description,
                is_active: true,
                created_by: "admin",
                url: "Admin/AddUpdateSeriveType",
            };

            try {
                const response = await vendorServiceType(payload);
                if (response.status) {
                    toast.success(editService ? "Service updated successfully" : "Service added successfully");
                    setOpenForm(false);
                    setEditService(null);
                } else toast.error(response.message);
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data || error?.message || "Something went wrong!");
            }
        },
    });

    // Edit service
    const handleEdit = (service) => {
        console.log(service)
        form.setValues({
            service_type_id: service.service_type_id,
            service_type: service.service_type,
            description: service.description,
        });
        setEditService(service);
        setOpenForm(true);
    };

    const columns = [
        { name: "ID", selector: (row, i) => i + 1, width: "60px" },
        { name: "Service Type", selector: row => row.service_type },
        { name: "Description", selector: row => row.description },
        {
            name: "Action",
            cell: row => (

                <button className="px-3 py-1 text-xs" onClick={() => handleEdit(row)}>
                    <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}

                </button>
            ),
        },
    ];

    const filteredData = services.filter(item =>
        `${item.service_type} ${item.description}`.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-100 min-h-screen">
                <Navbar />

                <div className="p-6">
                    {/* Header + Add button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Service Type Management</h2>
                        <button
                            onClick={() => { form.resetForm(); setEditService(null); setOpenForm(true); }}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            + Add Service Type
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

                {/* Centered Modal */}
                {openForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                  flex items-center justify-center z-50">

                        <div className="w-[450px] bg-white shadow-2xl rounded-lg 
                    max-h-[90vh] p-6 overflow-y-auto animate-popup">

                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    {editService ? "Edit Service" : "Add Service Type"}
                                </h3>
                                <button
                                    onClick={() => setOpenForm(false)}
                                    className="text-red-500 text-xl hover:text-red-700">
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={form.handleSubmit} className="grid grid-cols-1 gap-2">

                                <input
                                    type="text"
                                    name="service_type"
                                    placeholder="Service Type"
                                    value={form.values.service_type}
                                    onChange={form.handleChange}
                                    className="border border-gray-300 rounded-md p-2 mt-0 focus:ring-2 focus:ring-blue-400"
                                />
                                {form.touched.service_type && form.errors.service_type && (
                                    <p className="text-red-600 text-xs">{form.errors.service_type}</p>
                                )}

                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={form.values.description}
                                    onChange={form.handleChange}
                                    className="border border-gray-300 rounded-md p-2 mt-2 focus:ring-2 focus:ring-blue-400"
                                />
                                {form.touched.description && form.errors.description && (
                                    <p className="text-red-600 text-xs">{form.errors.description}</p>
                                )}

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 mt-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    {editService ? "Update Service" : "Add Service Type"}
                                </button>
                            </form>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
