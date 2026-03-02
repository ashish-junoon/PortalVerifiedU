import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import DataTable from 'react-data-table-component';
import Register from '../components/Register';
import { vendorGetServiceNameTypeList, vendorUpdateRegistration } from '../../services/Services_API';
import { toast } from "react-toastify";
import { CSVLink } from 'react-csv';
import Icon from '../../utils/Icon';

export default function AdminReports() {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userStatus, setUserStatus] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const payload = { url: 'Admin/GetVendorList' };
                const res = await vendorGetServiceNameTypeList(payload);

                if (res.status) {
                    setData(res.getVendorLists);
                } else {
                    toast.error(res.message);
                }

            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
                // setUpdateVendor(false);
            }
        };

        fetchData();
    }, []);   // ONLY updateVendor


    const columns = [
        { name: 'ID', selector: (row, index) => index + 1, sortable: true, width: '60px' },
        { name: 'Vendor Name', selector: row => row?.vendorname || "N/A", sortable: true },
        { name: 'Type', selector: row => row?.vendortype || "N/A" },
        { name: 'Code', selector: row => row?.vendorcode || "N/A", width: '80px', },
        { name: 'Company', selector: row => row?.companyname || "N/A" },
        { name: 'Email', selector: row => row?.vendoremail || "N/A" },
        { name: 'Mobile', selector: row => row?.mobile || "N/A" },
        { name: 'PAN', selector: row => row?.pannumber || "N/A".toUpperCase() },
        {
            name: 'Status',
            cell: row => (
                <label className="inline-flex items-center cursor-pointer">
                    <span className={`text-sm font-medium ${row.isactive ? 'text-green-800' : 'text-red-800'}`}>
                        {row.isactive ? 'Active' : 'Inactive'}
                    </span>
                </label>
            ),
            width: '100px'
        },
    ];

    const filteredData = data.filter((item) => {
        const matchesSearch =
            `${item.vendorname} ${item.vendorcode} ${item.vendoremail} ${item.username} ${item.mobile}`
                .toLowerCase()
                .includes(filterText.toLowerCase());

        const matchesStatus =
            userStatus === ""
                ? true
                : userStatus === "active"
                    ? item.isactive === true
                    : item.isactive === false;

        return matchesSearch && matchesStatus;
    });

    // something for ux
    const activeCount = data.filter(user => user.isactive === true).length;
    const inactiveCount = data.filter(user => user.isactive === false).length;
    const totalUsers = data.length;

    const activePercentage = totalUsers
        ? ((activeCount / totalUsers) * 100).toFixed(1)
        : 0;

    const inactivePercentage = totalUsers
        ? ((inactiveCount / totalUsers) * 100).toFixed(1)
        : 0;

    // if (loading) return <Loader message="Getting Report..." color="#63BB89" />
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <div className="-mt-1"></div>
                <Navbar />
                <div className="p-6 bg-gray-100 min-h-screen">

                    {/* FILTER BAR */}
                    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            {/* Search */}
                            <div className="relative w-full md:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, username..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>


                            {/* Status Filter */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <CSVLink
                                    data={filteredData}
                                    filename={"user_report.csv"}
                                    className="px-4 mr-4 py-1.5 bg-primary text-green text-semibold rounded flex items-center gap-2 shadow"
                                >
                                    <Icon name="RiFileExcel2Line" size={16} color="green" />
                                    Export
                                </CSVLink>

                                <label className="text-gray-600 font-medium whitespace-nowrap">
                                    Status:
                                </label>
                                <select
                                    name="status"
                                    value={userStatus}
                                    onChange={(e) => setUserStatus(e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                                >
                                    <option value="">All Users</option>
                                    <option value="active">Active Users</option>
                                    <option value="inactive">Inactive Users</option>
                                </select>
                            </div>

                            {/* Loading Indicator */}
                            {loading && (
                                <div className="text-blue-600 font-medium animate-pulse">
                                    Loading...
                                </div>
                            )}

                        </div>
                    </div>

                    {/* STATUS PROGRESS BAR */}
                    <div className="bg-white shadow-md rounded-xl p-2 mb-4">
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span className="text-green-700">
                                Active: {activeCount} ({activePercentage}%)
                            </span>
                            <span className="text-red-700">
                                Inactive: {inactiveCount} ({inactivePercentage}%)
                            </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                                className="bg-green-500 h-full transition-all duration-500"
                                style={{ width: `${activePercentage}%` }}
                            ></div>
                            <div
                                className="bg-red-500 h-full transition-all duration-500"
                                style={{ width: `${inactivePercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="bg-white shadow-lg rounded-xl p-4 w-[980px]">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            dense
                            progressPending={loading}
                            className="text-sm"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
