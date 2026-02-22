import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    vendorAssingService,
    vendorGetList,
    vendorGetServiceNameTypeList,
    vendorFetchServiceAssignList
} from "../../services/Services_API";

import DataTable from "react-data-table-component";
import Loader from "../../utils/Loader";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VendorServiceDetails from "./VendorServiceDetails";

export default function UserAssign() {

    const [users, setUsers] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editingPrice, setEditingPrice] = useState("");

    const [vendorService, setVendorService] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const vendorRes = await vendorGetList();
                setUsers(vendorRes.getVendorCodes);

                const serviceRes = await vendorGetServiceNameTypeList({
                    url: "Admin/GetServiceName"
                });
                console.log(serviceRes)
                if (serviceRes.status) setServicesList(serviceRes.serviceNames);

            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const saveUpdatedPrice = async (service_name_id) => {
        setServicesList(prev =>
            prev.map(item =>
                item.service_name_id === service_name_id
                    ? { ...item, price: editingPrice }
                    : item
            )
        );
        setEditingId(null);
    };

    const toggleServiceSelection = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(item => item.service_name_id === service.service_name_id);
            if (exists) {
                return prev.filter(item => item.service_name_id !== service.service_name_id);
            }
            return [
                ...prev,
                {
                    service_type: service.service_type,
                    service_type_id: service.service_type_id,
                    service_name: service.service_name,
                    service_name_id: service.service_name_id,
                    api_end_point:service.api_end_point,
                    price: service.price,
                }
            ];
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedServices([]);
            setSelectAll(false);
        } else {
            setSelectedServices(
                filteredData.map(s => ({
                    service_type: s.service_type,
                    service_type_id: s.service_type_id,
                    service_name: s.service_name,
                    service_name_id: s.service_name_id,
                    price: s.price,
                }))
            );
            setSelectAll(true);
        }
    };

    const validationSchema = Yup.object({
        vendorCode: Yup.string().required("Vendor is required"),
    });

    const filteredData = servicesList.filter(item =>
        `${item.service_type} ${item.service_name} ${item.price}`
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 cursor-pointer accent-blue-600"
                />
            ),
            width: "100px",
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={selectedServices.some(s => s.service_name_id === row.service_name_id ? 'checked' : '')}
                    onChange={() => toggleServiceSelection(row)}
                    className="w-5 h-5 cursor-pointer accent-blue-600"
                />
            )
        },
        { name: "Service Type", selector: row => row.service_type },
        { name: "Service Name", selector: row => row.service_name },
        {
            name: "Price",
            cell: (row) =>
                editingId === row.service_name_id ? (
                    <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2">
                        <span className="text-gray-500">₹</span>
                        <input
                            type="number"
                            value={editingPrice}
                            onChange={e => setEditingPrice(e.target.value)}
                            onBlur={() => saveUpdatedPrice(row.service_name_id)}
                            autoFocus
                            className="
            w-20
            bg-transparent
            outline-none
            text-gray-800
            text-sm
          "
                        />
                    </div>
                ) : (
                    <span
                        className="
          cursor-pointer
          px-2 py-1
          rounded-full
          hover:bg-gray-100
          text-gray-800
        "
                        title="Click to edit price"
                        onClick={() => {
                            setEditingId(row.service_name_id);
                            setEditingPrice(row.price);
                        }}
                    >
                        ₹ {row.price}
                    </span>
                )
        }

    ];

    const backButton = () => {
        setVendorService(false);
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {!vendorService && (
                <>
                    <h2 className="text-2xl font-semibold mb-6">
                        Vendor Service Assignment
                    </h2>

                    <Formik
                        initialValues={{ vendorCode: "" }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {

                            if (selectedServices.length === 0) {
                                toast.error("Please select at least one service");
                                return;
                            }

                            setLoading(true);
                            try {
                                for (const service of selectedServices) {
                                    if (!service.ServiceID) {
                                        const payload = {
                                            VendorCode: values.vendorCode,
                                            service_type_id: service.service_type_id,
                                            service_name_id: service.service_name_id,
                                            api_end_point:service.api_end_point,
                                            ServiceAmount: service.price,
                                            IsActive: true,
                                            createdBy: "Admin"
                                        };

                                        await vendorAssingService(payload);

                                    }
                                }

                                toast.success("All services assigned successfully");
                                setSelectedServices([]);

                            } catch (error) {
                                toast.error("Error assigning services");

                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {({ values, handleChange, errors, touched }) => (

                            <Form>

                                <div className="flex gap-4 mb-4">

                                    <input
                                        type="text"
                                        className="border px-4 py-2 rounded-lg w-1/2"
                                        placeholder="Search service..."
                                        value={filterText}
                                        onChange={e => setFilterText(e.target.value)}
                                    />

                                    <select
                                        name="vendorCode"
                                        value={values.vendorCode}
                                        onChange={async (e) => {
                                            handleChange(e);

                                            const vendorCode = e.target.value;
                                            if (!vendorCode) {
                                                setSelectedServices([]);
                                                setSelectAll(false);
                                                return;
                                            }

                                            try {
                                                const res = await vendorFetchServiceAssignList({
                                                    VendorCode: vendorCode,
                                                    url: "Admin/VendorServiceName",
                                                });

                                                if (res.status) {
                                                    const assigned = res.getVendorLists || [];
                                                    setSelectedServices(
                                                        assigned.map(s => ({
                                                            service_type: s.service_type,
                                                            service_type_id: s.service_type_id,
                                                            service_name: s.service_name,
                                                            service_name_id: s.service_name_id,
                                                            api_end_point:s.api_end_point,
                                                            price: s.price,
                                                            IsActive: s.IsActive,
                                                            ServiceID: s.ServiceID,
                                                        }))
                                                    );
                                                    console.log("assigned", assigned)
                                                    const allVisible = filteredData.map(d => d.service_name_id);
                                                    const assignedIds = assigned.map(s => s.service_name_id);

                                                    setSelectAll(allVisible.every(id => assignedIds.includes(id)) && allVisible.length > 0);
                                                } else {
                                                    setSelectedServices([]);
                                                }
                                            } catch {
                                                toast.error("Failed to fetch vendor services");
                                            }
                                        }}
                                        className="border px-4 py-2 rounded-lg w-1/2"
                                    >
                                        <option value="">Select Vendor</option>
                                        {users.map((u, idx) => (
                                            <option key={idx} value={u.vendorcode}>
                                                {u.username || u.vendorcode}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {errors.vendorCode && touched.vendorCode && (
                                    <p className="text-red-600 text-sm mb-2">{errors.vendorCode}</p>
                                )}

                                <div className="flex gap-4 mb-6">
                                    {/* Assign Services Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none"
                                    >
                                        <span className="text-lg font-semibold">{loading?"Assigning...":"Assign Services"}</span>
                                    </button>

                                    {/* Vendor Services Button */}
                                    <button
                                        type="button"
                                        onClick={() => setVendorService(true)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-500 text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-400 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        <span className="text-lg font-semibold">Edit Vendor Services Details</span>
                                    </button>
                                </div>


                                <div className="bg-white p-4 rounded shadow">
                                    <DataTable
                                        columns={columns}
                                        data={filteredData}
                                        pagination
                                        highlightOnHover
                                    />
                                </div>

                            </Form>
                        )}
                    </Formik>
                </>
            )}

            {vendorService && <VendorServiceDetails backButton={backButton} />}

        </div>
    );
}
