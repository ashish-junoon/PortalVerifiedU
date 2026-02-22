import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import DataTable from 'react-data-table-component';
import Register from '../components/Register';
import { vendorGetServiceNameTypeList, vendorUpdateRegistration } from '../../services/Services_API';
import { toast } from "react-toastify";
import { FaEdit } from 'react-icons/fa';
import Loader from '../../utils/Loader';

export default function UserList() {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);
    const [userUpdate, setUserUpdate] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateVendor, setUpdateVendor] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             const payload = { url: 'Admin/GetVendorList' };
    //             const res = await vendorGetServiceNameTypeList(payload);
                
    //             if (res.status){
    //                 console.log(res);
    //                setUpdateVendor(false); 
    //                setData(res.getVendorLists);
    //             } 
    //             else toast.error(res.message);
    //         } catch (err) {
    //             toast.error(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, [openForm,updateVendor]);

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
}, [openForm,updateVendor]);   // ONLY updateVendor



    const handleEdit = (user) => {
        setUserUpdate(user);
        setOpenForm(true);
    };

    const handleCreateUser = () => {
        setUserUpdate(null);
        setOpenForm(true);
    };

    // const handleToggle = async(id,isActive) => {
    //     // Placeholder toggle logic
    //     isActive = !isActive;
    //     try {
    //             setLoading(true);
                
    //             const payload = { 
    //             Id:id,
    //             IsActive:isActive,
    //             Type:"VendorRegister",
    //             url: 'User/UpdateStatus' };
    //             const res = await vendorUpdateRegistration(payload);
    //             if (res.Status) setUpdateVendor(true);
    //             else toast.error(res.message);
    //         } catch (err) {
    //             toast.error(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
       
    // };

const handleToggle = async (id, isActive) => {
    isActive = !isActive;
    try {
        const payload = {
            Id: id,
            IsActive: isActive,
            Type: "VendorRegister",
            url: 'User/UpdateStatus'
        };

        const res = await vendorUpdateRegistration(payload);
        if (res.Status) {
            setUpdateVendor(prev => !prev);   // <--- FORCE ONE RELOAD ONLY
        } else {
            toast.error(res.message);
        }

    } catch (err) {
        toast.error(err.message);
    }
};


    
    const columns = [
        { name: 'ID', selector: (row, index) => index + 1, sortable: true, width: '60px' },
        { name: 'Vendor Name', selector: row => row.vendorname, sortable: true },
        { name: 'Code', selector: row => row.vendorcode },
        { name: 'Email', selector: row => row.vendoremail },
        { name: 'Mobile', selector: row => row.mobile },
        {
            name: 'Status',
            cell: row => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.isactive}
                        onChange={() => handleToggle(row.id,row.isactive)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className={`ms-2 text-sm font-medium ${row.isactive ? 'text-green-800' : 'text-red-800'}`}>
                        {row.isactive ? 'Active' : 'Inactive'}
                    </span>
                </label>
            )
        },
        {
            name: 'Action',
            cell: row => (
                <button className="px-3 py-1 text-xs" onClick={() => handleEdit(row)}>
                    <FaEdit  className="w-6 h-6"/> {/* Or <FaEdit /> */}

                </button>
            )
        }
    ];

    const filteredData = data.filter(item =>
        `${item.vendorname} ${item.vendorcode} ${item.vendoremail} ${item.username} ${item.mobile}`
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );
// if (loading) return <Loader message="Getting Report..." color="#63BB89" />
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <Navbar />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                        <button
                            onClick={handleCreateUser}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            + Create User
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name, email, username"
                        className="mb-4 px-4 py-2 border border-gray-300 rounded w-80"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                    {loading && (
                    <span className="text-blue-600 font-medium">Loading...</span>
                )}
                    <div className="bg-white shadow-lg rounded-xl p-4">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            progressPending={loading}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Slide-in Form */}
                {openForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
                        <div className="w-[450px] bg-white shadow-2xl h-full p-6 overflow-y-auto animate-slide-left">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{userUpdate ? "Edit User" : "Create User"}</h3>
                                <button onClick={() => setOpenForm(false)} className="text-red-500 text-xl hover:text-red-700">✕</button>
                            </div>

                            <Register cancelClose={() => setOpenForm(false)} userUpdate={userUpdate} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
