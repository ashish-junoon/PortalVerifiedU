import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MdEdit } from "react-icons/md";
import {
  vendorGetServiceTypeList,
  vendorServiceType,
  vendorUpdateRegistration,
} from "../../services/Services_API";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ServiceTypeMaster() {
  const [services, setServices] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const navigate = useNavigate();

  const { isAdmin } = useContext(AuthContext);

  // Fetch services
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await vendorGetServiceTypeList({
        url: "Admin/GetServiceType",
      });
      if (res.status) setServices(res.serviceTypes);
      // else toast.error(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          toast.success(
            editService
              ? "Service updated successfully"
              : "Service added successfully",
          );
          setOpenForm(false);
          setEditService(null);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data || error?.message || "Something went wrong!",
        );
      }
    },
  });

  // ==============================
  // To Active/ Deactive Service
  // ==============================
  const handleToggle = async (id, isActive) => {
    const newStatus = !isActive;

    try {
      setLoading(true);

      const payload = {
        Id: id,
        IsActive: newStatus,
        Type: "ServiceType",
        url: "User/UpdateStatus",
      };

      const res = await vendorUpdateRegistration(payload);
      if (res.Status) {
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit service
  const handleEdit = (service) => {
    // console.log(service);
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
    { name: "Service Type", selector: (row) => row.service_type },
    { name: "Description", selector: (row) => row.description },
    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            // disabled={isEmployee}
            type="checkbox"
            className="sr-only peer"
            checked={row.is_active}
            onChange={() => {
              handleToggle(row.service_type_id, row.is_active);
            }}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          disabled={isAdmin}
          className="px-3 py-1 text-xs"
          onClick={() => handleEdit(row)}
        >
          <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}
        </button>
      ),
    },
  ];

  const filteredData = services?.filter((item) =>
    `${item.service_type} ${item.description}`
      .toLowerCase()
      .includes(filterText.toLowerCase()),
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen overflow-hidden w-full mt-10">
        {/* <Navbar /> */}

        <div className="p-3 md:p-6">
          {/* Header + Add button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              Service Type Management
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/service-master")}
                className="bg-black text-white font-semibold md:px-5 px-3 py-2 rounded-lg shadow hover:bg-black/70 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  form.resetForm();
                  setEditService(null);
                  setOpenForm(true);
                }}
                className="bg-primary font-semibold text-white md:px-5 px-3 py-2 rounded-lg shadow hover:bg-primarydark transition cursor-pointer"
              >
                + Add Service Type
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search service..."
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 w-80"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            {/* {loading && (
              <span className="text-blue-600 font-medium">Loading...</span>
            )} */}
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
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                  flex items-center justify-center z-50"
          >
            <div
              className="w-[450px] bg-white shadow-2xl rounded-lg 
                    max-h-[90vh] p-6 overflow-y-auto animate-popup"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editService ? "Edit Service" : "Add Service Type"}
                </h3>
                <button
                  onClick={() => setOpenForm(false)}
                  className="text-red-500 text-xl hover:text-red-700"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={form.handleSubmit}
                className="grid grid-cols-1 gap-2"
              >
                <input
                  type="text"
                  name="service_type"
                  placeholder="Service Type"
                  value={form.values.service_type}
                  onChange={form.handleChange}
                  className="border border-gray-300 rounded-md p-2 mt-0 focus:ring-2 focus:ring-blue-400"
                />
                {form.touched.service_type && form.errors.service_type && (
                  <p className="text-red-600 text-xs">
                    {form.errors.service_type}
                  </p>
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
                  <p className="text-red-600 text-xs">
                    {form.errors.description}
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-primary text-white py-2 mt-2 rounded-md hover:bg-primarydark transition"
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
