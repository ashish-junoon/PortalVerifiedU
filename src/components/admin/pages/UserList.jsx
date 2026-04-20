import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import DataTable from "react-data-table-component";
import Register from "../components/Register";
import {
  vendorGetServiceNameTypeList,
  vendorUpdateRegistration,
} from "../../services/Services_API";
import { toast } from "react-toastify";
import { FaEdit, FaEye } from "react-icons/fa";
import Loader from "../../utils/Loader";
import VendorData from "../components/VendorData";
import VendorDetails from "./VendorDetails";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function UserList() {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const [userUpdate, setUserUpdate] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateVendor, setUpdateVendor] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [openVendor, setOpenVendor] = useState(false);
  const navigate = useNavigate();

  const { isEmployee, isAdmin, isAdministrator } = useContext(AuthContext);

  const roleslist = [
    {
      value: "admin",
      label:"Admin"
    },
    {
      value: "employee",
      label:"Employee"
    },
    {
      value: "administrator",
      label:"Administrator"
    },
    {
      value: "vendor",
      label:"Vendor"
    },
  ]

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = { url: "Admin/GetVendorList" };
      const res = await vendorGetServiceNameTypeList(payload);

      if (res.status) {
        setData(res.getVendorLists || res.vendorServiceLists);
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

  useEffect(() => {
    fetchData();
  }, [openForm, updateVendor]); // ONLY updateVendor

  const handleEdit = (user) => {
    setUserUpdate(user);
    setOpenForm(true);
  };

  const ViewVendor = (user) => {
    setUserDetails(user);
    // setOpenVendor(true);
    navigate("/admin/user-details", {
      state: { userVendorCode: user.vendorcode },
    });
    // console.log(user);
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
        url: "User/UpdateStatus",
      };

      const res = await vendorUpdateRegistration(payload);
      if (res.Status) {
        // setUpdateVendor((prev) => !prev); // <--- FORCE ONE RELOAD ONLY
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendorname || "N/A",
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row.vendorcode || "N/A",
      width: "100px",
    },
    {
      name: "Email",
      selector: (row) => row.vendoremail || "N/A",
      width: "220px",
    },
    { name: "Mobile", selector: (row) => row.mobile || "N/A" },
    { name: "Role", selector: (row) => row.role || "N/A" },
    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            disabled={isEmployee || isAdmin || loading}
            type="checkbox"
            className="sr-only peer"
            checked={row.isactive}
            onChange={() => handleToggle(row.id, row.isactive)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          {/* <span
            className={`ms-2 text-sm font-medium ${row.isactive ? "text-green-800" : "text-red-800"}`}
          >
            {row.isactive ? "Active" : "Inactive"}
          </span> */}
        </label>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          disabled={isEmployee}
          className="px-3 py-1 text-xs"
          onClick={() => handleEdit(row)}
        >
          <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}
        </button>
      ),
    },
    {
      name: "View",
      cell: (row) => (
        <button
          className="px-3 py-1 text-lg cursor-pointer flex items-center gap-1"
          onClick={() => ViewVendor(row)}
        >
          <FaEye className="text-2xl" />
        </button>
      ),
    },
    {
      name: "Services",
      cell: (row) => (
        <button
          className="px-3 py-1 text-md cursor-pointer bg-primary text-white rounded-md font-semibold"
          onClick={() =>
            navigate("/admin/user-assign", {
              state: { vendorCode: row.vendorcode },
            })
          }
        >
          Assign
        </button>
      ),
    },
  ];

  const filteredData = data?.filter((item) =>
    `${item.vendorname} ${item.vendorcode} ${item.vendoremail} ${item.username} ${item.mobile} ${item.role}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
      &&
      (isAdministrator ? true // only admins
    : item.role !== "administrator")
  );


  // if (loading) return <Loader message="Getting Report..." color="#63BB89" />

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen w-full overflow-hidden mt-12">
        {/* <Navbar /> */}
        {!openVendor && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                User Management
              </h2>
              {!isEmployee && (
                <button
                  onClick={handleCreateUser}
                  className="bg-primary text-white md:px-3 px-3 py-1.5 rounded-lg shadow hover:bg-primarydark cursor-pointer font-semibold transition"
                >
                  + Create User
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Search by name, email, username"
              className="mb-4 px-4 py-1.5 border border-gray-200 bg-white rounded-md w-80"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <select
              name="vendorCode"
              value={filterText} // Added userVendorCode
              onChange={(e) => setFilterText(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-1.5 rounded-lg ml-2 md:w-1/4 max-md:w-full"
            >
              <option value="">Select Vendor</option>
              {roleslist?.map((role, idx) => (
                <option key={idx} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            {/* {loading && (
            <span className="text-blue-600 font-medium">Loading...</span>
          )} */}
            <div className="bg-white shadow-lg rounded-xl p-3">
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                striped
                // progressPending={loading}
                className="text-sm"
              />
            </div>
          </div>
        )}

        {/* Slide-in Form */}
        {openForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
            {/* <div className="w-[450px] bg-white shadow-2xl h-full p-6 overflow-y-auto animate-slide-left"> */}
            {/* <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{userUpdate ? "Edit User" : "Create User"}</h3>
                                <button onClick={() => setOpenForm(false)} className="text-red-500 text-xl hover:text-red-700">✕</button>
                            </div> */}

            {/* </div> */}
            {/* Commented by RK  */}
            <Register
              cancelClose={() => setOpenForm(false)}
              userUpdate={userUpdate}
            />
          </div>
        )}

        {/* {openVendor && (
          // <VendorData userDetails={userDetails} setOpenVendor={setOpenVendor} />
          <VendorDetails handleEdit={handleEdit} userDetails={userDetails} setOpenVendor={setOpenVendor}/>
        )} */}
      </div>
    </div>
  );
}
