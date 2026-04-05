import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  vendorAssingService,
  vendorGetList,
  vendorGetServiceNameTypeList,
  vendorFetchServiceAssignList,
  vendorUpdateRegistration,
  vendorAssingServiceArr,
} from "../../services/Services_API";

import DataTable from "react-data-table-component";
import Loader from "../../utils/Loader";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VendorServiceDetails from "./VendorServiceDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import FormUserAssign from "../components/FormUserAssign";

export default function UserAssign() {
  const [users, setUsers] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [AssignUserService, setAssignUserService] = useState(false);
  const [servicesTypeList, setServicesTypeList] = useState([]);
  const [editService, setEditService] = useState(null);
  // console.log(servicesList);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState(0);

  const [vendorService, setVendorService] = useState(false);
  const location = useLocation();
  const userVendorCode = location?.state?.vendorCode;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userVendorCode) {
      navigate("/admin/user-list");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vendorRes = await vendorGetList();
        setUsers(vendorRes.getVendorCodes);

        const serviceRes = await vendorGetServiceNameTypeList({
          url: "Admin/GetServiceName",
        });
        // console.log(serviceRes.serviceNames)
        if (serviceRes.status) setServicesList(serviceRes.serviceNames);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    // fetchData();
  }, []);

  // ==============================
  // Fetching all and user Services
  // and combining them
  // ==============================

  const fetchData = async () => {
    const serviceRes = await vendorGetServiceNameTypeList({
      url: "Admin/GetServiceName",
    });

    const vendorRes = await vendorFetchServiceAssignList({
      VendorCode: userVendorCode,
      url: "Admin/VendorServiceName",
    });

    // const serviceListRes = await vendorGetServiceNameTypeList({ url: "Admin/GetServiceName" });
    // if (serviceListRes.status) setServicesList(serviceListRes.serviceNames);

    if (serviceRes.status) {
      const services = serviceRes.serviceNames || [];
      const vendorServices = vendorRes?.getVendorLists || [];

      // 🔥 merge logic
      const updatedServices = services.map((service) => {
        const matchedVendorService = vendorServices.find(
          (v) => v.service_name_id === service.service_name_id,
        );

        return {
          ...service,
          // realprice: matchedVendorService ? matchedVendorService.price : null,
          realprice: matchedVendorService?.price ?? service.price,
          ServiceID: matchedVendorService?.ServiceID || null,
          IsActive: matchedVendorService?.IsActive || false,
        };
      });

      setServicesList(updatedServices);
      setServicesTypeList(serviceRes.serviceNames);
    }
  };

  useEffect(() => {
    fetchData();
  }, [AssignUserService]);

  // const saveUpdatedPrice = async (service_name_id) => {
  //   setServicesList((prev) =>
  //     prev.map((item) =>
  //       item.service_name_id === service_name_id
  //         ? { ...item, realprice: editingPrice } //price to realprice
  //         : item,
  //     ),
  //   );
  //   setEditingId(null);
  // };

  const saveUpdatedPrice = (service_name_id, value) => {
    setServicesList((prev) =>
      prev.map((item) =>
        item.service_name_id === service_name_id
          ? { ...item, realprice: value }
          : item,
      ),
    );

    // 🔥 SYNC selectedServices
    setSelectedServices((prev) =>
      prev.map((item) =>
        item.service_name_id === service_name_id
          ? { ...item, realprice: value, price: value }
          : item,
      ),
    );

    setEditingId(null);
  };

  // const toggleServiceSelection = (service) => {
  //   setSelectedServices((prev) => {
  //     const exists = prev.find(
  //       (item) => item.service_name_id === service.service_name_id,
  //     );
  //     if (exists) {
  //       return prev?.filter(
  //         (item) => item.service_name_id !== service.service_name_id,
  //       );
  //     }
  //     return [
  //       ...prev,
  //       {
  //         service_type: service.service_type,
  //         service_type_id: service.service_type_id,
  //         service_name: service.service_name,
  //         service_name_id: service.service_name_id,
  //         api_end_point: service.api_end_point,
  //         // price: service.price,
  //         price: service.realprice || service.price,
  //         realprice: service.realprice,
  //       },
  //     ];
  //   });
  // };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find(
        (item) => item.service_name_id === service.service_name_id,
      );

      if (exists) {
        return prev.filter(
          (item) => item.service_name_id !== service.service_name_id,
        );
      }

      return [
        ...prev,
        {
          service_type: service.service_type,
          service_type_id: service.service_type_id,
          service_name: service.service_name,
          service_name_id: service.service_name_id,
          api_end_point: service.api_end_point,

          // 🔥 THIS IS THE FIX
          realprice: service.realprice ?? service.price,
          price: service.realprice ?? service.price,
        },
      ];
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedServices([]);
      setSelectAll(false);
    } else {
      // setSelectedServices(
      //   filteredData.map((s) => ({
      //     service_type: s.service_type,
      //     service_type_id: s.service_type_id,
      //     service_name: s.service_name,
      //     service_name_id: s.service_name_id,
      //     price: s.price,
      //     realprice: s.realprice,
      //   })),
      // );
      setSelectedServices(
        filteredData.map((s) => ({
          service_type: s.service_type,
          service_type_id: s.service_type_id,
          service_name: s.service_name,
          service_name_id: s.service_name_id,
          api_end_point: s.api_end_point,

          realprice: s.realprice ?? s.price,
          price: s.realprice ?? s.price,
        })),
      );
      setSelectAll(true);
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setAssignUserService(true);
  };

  const validationSchema = Yup.object({
    vendorCode: Yup.string().required("Vendor is required"),
  });

  // ==============================
  // Filtering Data on Search
  // ==============================
  const filteredData = servicesList?.filter((item) =>
    `${item.service_type} ${item.service_name} ${item.price}`
      .toLowerCase()
      .includes(filterText.toLowerCase()),
  );

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
        Type: "AssignService",
        url: "User/UpdateStatus",
      };

      const res = await vendorUpdateRegistration(payload);
      if (res.Status) {
        // ✅ Update only that row locally
        setServicesList((prev) =>
          prev.map((item) =>
            item.ServiceID === id ? { ...item, IsActive: newStatus } : item,
          ),
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
          checked={selectedServices.some(
            (s) => s.service_name_id === row.service_name_id,
          )}
          onChange={() => {
            (toggleServiceSelection(row), console.log(row));
          }}
          className="w-5 h-5 cursor-pointer accent-blue-600"
        />
      ),
    },
    { name: "Service Type", selector: (row) => row.service_type },
    { name: "Service Name", selector: (row) => row.service_name },
    { name: "Base Price", selector: (row) => "₹ " + row.price },
    {
      name: "Vendor Price",
      cell: (row) =>
        editingId === row.service_name_id ? (
          <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2">
            <span className="text-gray-500">₹</span>
            <input
              type="number"
              // max={3}
              value={editingPrice}
              onChange={(e) => {
                setEditingPrice(e.target.value); // free typing allow
              }}
              onBlur={() => {
                let value = Number(editingPrice);

                // ❗ minimum base price lock
                if (value < row.price) {
                  value = row.price;
                }

                // ❗ agar empty ya NaN ho
                if (!value) {
                  value = row.price;
                }

                setEditingPrice(value);
                saveUpdatedPrice(row.service_name_id, value);
              }}
              autoFocus
              className="w-20 bg-transparent outline-none text-gray-800 text-sm"
            />
          </div>
        ) : (
          <span
            className="cursor-pointer px-2 py-1 rounded-full hover:bg-gray-100 text-gray-800"
            title="Click to edit price"
            onClick={() => {
              setEditingId(row.service_name_id);
              setEditingPrice(row.realprice);
            }}
          >
            ₹ {row.realprice || 0}
          </span>
        ),
    },
    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.IsActive}
            onChange={() => {row.ServiceID ? handleToggle(row.ServiceID, row.IsActive) : toast.info("Assign Service First!")}}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="px-3 py-1 text-xs"
          type="button"
          onClick={() => {
            (handleEdit(row), console.log(row));
          }}
        >
          <FaEdit className="w-6 h-6" /> {/* Or <FaEdit /> */}
        </button>
      ),
    },
  ];

  const backButton = () => {
    setVendorService(false);
  };

  // console.log(filteredData);

  const getSingleUserService = async (vendorCode) => {
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
        const assigned = res.getVendorLists || res.vendorServiceLists || [];
        
        setSelectedServices(
          assigned.map((s) => ({
            service_type: s.service_type,
            service_type_id: s.service_type_id,
            service_name: s.service_name,
            service_name_id: s.service_name_id,
            api_end_point: s.api_end_point,
            price: s.price,
            IsActive: s.IsActive,
            ServiceID: s.ServiceID,
          })),
        );

        const allVisible = filteredData.map((d) => d.service_name_id);
        const assignedIds = assigned.map((s) => s.service_name_id);

        setSelectAll(
          allVisible.every((id) => assignedIds.includes(id)) &&
            allVisible.length > 0,
        );
      } else {
        setSelectedServices([]);
      }
    } catch {
      toast.error("Failed to fetch vendor services");
    }
  };
  

  useEffect(() => {
    if (!userVendorCode) return;
    getSingleUserService(userVendorCode);
  }, []);
  // console.log(selectedServices);
  if (loading) return <Loader />;

  return (
    <div className="p-6 max-md:p-3 bg-gray-100 min-h-screen">
      {!vendorService && (
        <>
          <h2 className="text-xl font-semibold">Vendor Service Assignment</h2>
          <p className="mb-4 text-xs">Vendor Code: {userVendorCode}</p>
          <Formik
            initialValues={{ vendorCode: "" }}
            // validationSchema={validationSchema}
            onSubmit={async (values) => {
              let data = [];
              if (selectedServices.length === 0) {
                toast.error("Please select at least one service");
                return;
              }
              console.log(selectedServices);
              
              for (const service of selectedServices) {
                
                let tempReq = {
                  vendor_code: userVendorCode || values.vendorCode,
                  service_type_id: service.service_type_id,
                  service_name_id: service.service_name_id,
                  api_end_point: service.api_end_point,
                  service_amount: service.realprice,
                  is_active: true,
                  created_by: "Admin",
                };
                data = [...data, tempReq];
              }

              const payload = { servicesArray: data };
              setLoading(true);
              try {
                const res = await vendorAssingServiceArr(payload);
                if (res.status) {
                  // console.log(payload);
                  toast.success("All services assigned successfully");
                  fetchData();
                }
              } catch (error) {
                console.log("Error :", error);
                toast.error("Error assigning services");
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <div className="flex justify-between max-md:flex-col">
                  <div className="flex gap-4 mb-4 max-md:flex-col max-md:gap-1">
                    <input
                      type="text"
                      className="border border-gray-300 max-h-10 px-2 py-0 rounded-lg w-full outline-none"
                      placeholder="Search service..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />

                    {/* Note in Use hidden */}
                    <select
                      name="vendorCode"
                      value={userVendorCode || values.vendorCode} // Added userVendorCode
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
                            const assigned =
                              res.getVendorLists ||
                              res.vendorServiceLists ||
                              [];
                            setSelectedServices(
                              assigned.map((s) => ({
                                service_type: s.service_type,
                                service_type_id: s.service_type_id,
                                service_name: s.service_name,
                                service_name_id: s.service_name_id,
                                api_end_point: s.api_end_point,
                                price: s.price,
                                IsActive: s.IsActive,
                                ServiceID: s.ServiceID,
                              })),
                            );
                            console.log("assigned", assigned);
                            const allVisible = filteredData.map(
                              (d) => d.service_name_id,
                            );
                            const assignedIds = assigned.map(
                              (s) => s.service_name_id,
                            );

                            setSelectAll(
                              allVisible.every((id) =>
                                assignedIds.includes(id),
                              ) && allVisible.length > 0,
                            );
                          } else {
                            setSelectedServices([]);
                          }
                        } catch {
                          toast.error("Failed to fetch vendor services");
                        }
                      }}
                      className="border border-gray-300 px-4 py-2 rounded-lg md:w-1/2 max-md:w-full hidden"
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
                    <p className="text-red-600 text-sm mb-2">
                      {errors.vendorCode}
                    </p>
                  )}

                  <div className="flex justify-end gap-4 max-md:gap-1 mb-6 max-md:flex-col w-full">
                    {/* Assign Services Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center max-md:w-full gap-2 bg-gradient-to-r from-primary to-primarydark text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none"
                    >
                      <span className="text-md font-semibold">
                        {loading ? "Assigning..." : "Assign Services"}
                      </span>
                    </button>

                    {/* Vendor Services Button */}
                    {/* <button
                      type="button"
                      onClick={() => setVendorService(true)}
                      className="flex items-center max-md:w-full gap-2 bg-gradient-to-r from-gray-300 to-gray-500 text-black px-6 py-2 rounded-lg shadow-lg hover:bg-gray-400 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <span className="text-md font-semibold">
                        Edit Vendor Services Details
                      </span>
                    </button> */}
                  </div>
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

      {AssignUserService && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                  flex items-center justify-center z-50"
        >
          <div
            className="w-[650px] bg-white shadow-2xl rounded-lg 
                    max-h-[90vh] p-6 overflow-y-auto animate-popup"
          >
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
              selectedVendor={userVendorCode}
              // selectedVendor={selectedVendor}
            />
          </div>
        </div>
      )}

      {vendorService && (
        <VendorServiceDetails
          userVendorCode={userVendorCode}
          backButton={backButton}
        />
      )}
    </div>
  );
}
