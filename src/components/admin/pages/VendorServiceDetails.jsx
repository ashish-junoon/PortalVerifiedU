import { useEffect, useState } from "react";
import FormUserAssign from "../components/FormUserAssign";
import { toast } from "react-toastify";
import {
    vendorFetchServiceAssignList,
    vendorGetList,
    vendorGetServiceNameTypeList,
    vendorGetServiceTypeList,
    vendorUpdateRegistration
} from "../../services/Services_API";
import { FaEdit } from 'react-icons/fa';
import DataTable from "react-data-table-component";
import Loader from "../../utils/Loader";

export default function VendorServiceDetails({ backButton }) {

    const [users, setUsers] = useState([]);
    const [servicesTypeList, setServicesTypeList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [servicesAssignList, setServicesAssignList] = useState([]);
    const [filterText, setFilterText] = useState("");

    const [loading, setLoading] = useState(false);
    const [AssignUserService, setAssignUserService] = useState(false);
    const [editService, setEditService] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState("");

    // -----------------------
    // API CALLS
    // -----------------------
    // useEffect(() => {

    //     const fetchData = async () => {
    //         // if (!updateVendor && AssignUserService) return;
    //         try {
    //             setLoading(true);

    //             const vendorRes = await vendorGetList();
    //             setUsers(vendorRes.getVendorCodes);

    //             const typeRes = await vendorGetServiceTypeList({ url: "Admin/GetServiceType" });
    //             if (typeRes.status) setServicesTypeList(typeRes.serviceTypes);

    //             const serviceRes = await vendorGetServiceNameTypeList({ url: "Admin/GetServiceName" });
    //             if (serviceRes.status) setServicesList(serviceRes.serviceNames);

    //             const assignRes = await vendorFetchServiceAssignList({
    //                 VendorCode: "",
    //                 url: "Admin/VendorServiceName",
    //             });
    //             if (assignRes.status) setServicesAssignList(assignRes.getVendorLists) ;

    //         } catch (error) {
    //             toast.error("Failed to load data");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [AssignUserService,updateVendor]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const vendorRes = await vendorGetList();
                setUsers(vendorRes.getVendorCodes);

                const typeRes = await vendorGetServiceTypeList({ url: "Admin/GetServiceType" });
                if (typeRes.status) setServicesTypeList(typeRes.serviceTypes);

                const serviceRes = await vendorGetServiceNameTypeList({ url: "Admin/GetServiceName" });
                if (serviceRes.status) setServicesList(serviceRes.serviceNames);

                const assignRes = await vendorFetchServiceAssignList({
                    VendorCode: "",
                    url: "Admin/VendorServiceName",
                });
                if (assignRes.status) {
                    setServicesAssignList(assignRes.getVendorLists);
                }

            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [AssignUserService]);


    const handleToggle = async (id, isActive) => {
        const newStatus = !isActive;

        try {
            setLoading(true);

            const payload = {
                Id: id,
                IsActive: newStatus,
                Type: "AssignService",
                url: "User/UpdateStatus"
            };

            const res = await vendorUpdateRegistration(payload);

            if (res.Status) {
                // ✅ Update only that row locally
                setServicesAssignList(prev =>
                    prev.map(item =>
                        item.ServiceID === id
                            ? { ...item, IsActive: newStatus }
                            : item
                    )
                );
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { name: "ID", selector: (row, i) => i + 1, grow: 0.2 },
        { name: "Vendor Code", selector: row => row.vendor_code, sortable: true },
        { name: "Service Type", selector: row => row.service_type },
        { name: "Service Name", selector: row => row.service_name },
        { name: "Price", selector: row => row.price },
        {
            name: 'Status',
            cell: row => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.IsActive}
                        onChange={() => handleToggle(row.ServiceID, row.IsActive)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className={`ms-2 text-sm font-medium ${row.IsActive ? 'text-green-800' : 'text-red-800'}`}>
                        {row.IsActive ? 'Active' : 'Inactive'}
                    </span>
                </label>
            )
        },
        {
            name: "Action",
            cell: row => (
                <button className="px-3 py-1 text-xs" onClick={() => handleEdit(row)}>
                    <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}

                </button>
            ),
        },
    ];

    const filteredData = servicesAssignList.filter(item =>
        `${item.vendor_code} ${item.service_type} ${item.service_name} ${item.price}`
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    const handleEdit = (service) => {
        setEditService(service);
        setAssignUserService(true);
    };
    // if (loading) return <Loader message="Getting Report..." color="#63BB89" />
    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* ========================
               HEADER + ACTION BAR
            ========================== */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Vendor Service Active & Deactive
                </h2>

                <button
                    onClick={backButton}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Back
                </button>
            </div>

            {/* ========================
                SEARCH FIELD
            ========================== */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Search Box */}
                <div className="relative w-80">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search vendor / service..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>

                {/* Vendor Select */}
                <div className="relative w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        👤
                    </span>
                    <select
                        name="vendorCode"
                        value={selectedVendor}
                        onChange={async (e) => {
                            const vendorCode = e.target.value;
                            setSelectedVendor(vendorCode);

                            if (!vendorCode) {
                                setServicesAssignList([]);
                                return;
                            }

                            try {
                                const res = await vendorFetchServiceAssignList({
                                    VendorCode: vendorCode,
                                    url: "Admin/VendorServiceName",
                                });

                                if (res.status) {
                                    setServicesAssignList(res.getVendorLists || []);
                                } else {
                                    setServicesAssignList([]);
                                }
                            } catch {
                                toast.error("Failed to fetch vendor services");
                            }
                        }}
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    >
                        <option value="">Select Vendor</option>
                        {users.map((u, idx) => (
                            <option key={idx} value={u.vendorcode}>
                                {u.username || u.vendorcode}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loading */}
                {loading && (
                    <span className="text-blue-600 font-medium">Loading...</span>
                )}
            </div>


            {/* ========================
                TABLE CARD
            ========================== */}
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

            {/* ========================
                SLIDE-IN FORM (MODAL)
            ========================== */}
            {AssignUserService && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                  flex items-center justify-center z-50">

                    <div className="w-[650px] bg-white shadow-2xl rounded-lg 
                    max-h-[90vh] p-6 overflow-y-auto animate-popup">

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Assign Service</h3>

                            <button
                                onClick={() => setAssignUserService(false)}
                                className="text-red-500 text-xl hover:text-red-700"
                            >
                                ✕
                            </button>
                        </div>

                        <FormUserAssign
                            user={users}
                            servicesTypeList={servicesTypeList}
                            servicesList={servicesList}
                            editService={editService}
                            cancelClose={() => setAssignUserService(false)}
                            placeholder="Select a user"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


// start new deploye