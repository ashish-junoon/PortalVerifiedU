import { useContext, useEffect, useState } from "react";
import {
  FetchVendorDocuments,
  GetServicesUses,
  GetVendorServicesUsage,
  vendorFetchServiceAssignList,
  vendorGetServiceNameTypeList,
  vendorGetServiceTypeList,
} from "../../services/Services_API";
import DataTable, { createTheme } from "react-data-table-component";
import Sidebar from "../Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Register from "../components/Register";
import DateFilter from "../../utils/DateFilter";
import { CSVLink } from "react-csv";
import Icon from "../../utils/Icon";
import { AuthContext } from "../../Context/AuthContext";
import FileUploadModal from "../../utils/FileUploadModal";

const VendorDetails = ({ setOpenVendor }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userDetails, setuserDetails] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [userUpdate, setUserUpdate] = useState(null);
  const [isfilter, setisfilter] = useState(false);
  const [usageHistory, setusageHistory] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [Documents, setDocuments] = useState([]);
  const [selectedService, setselectedService] = useState("");

  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const userVendorCode = location.state.userVendorCode;

  const {isEmployee, isAdmin, isAdministrator} = useContext(AuthContext)

  const vendor = {
    user: userDetails?.username,
    name: userDetails?.companyname,
    email: userDetails?.vendoremail,
    phone: userDetails?.mobile,
    status: userDetails?.isactive,
    type: userDetails?.vendortype?.replaceAll("_", " "),
    address:
      userDetails?.officeaddress +
      " " +
      userDetails?.state +
      " " +
      userDetails?.zipcode,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const payload = { url: "Admin/GetVendorList" };
        const res = await vendorGetServiceNameTypeList(payload);

        if (res.status) {
          let data = res.getVendorLists || res.vendorServiceLists;
          let user = data?.filter(
            (u) => u.vendorcode.toLowerCase() === userVendorCode.toLowerCase(),
          );
          setuserDetails(user[0]);
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
  }, [openForm]);

  const fetchDocuments = async () => {
    const req = {
      vendor_code: userVendorCode,
      url:"/Admin/GetVendorDocument"
    }

    try {
      const response = await FetchVendorDocuments(req)

      if(response.status){
        setDocuments(response.documents)
      }
    } catch (error) {
      console.error("Error in Fetching Documents: ", error)
    }
  }

  useEffect(()=> {
    fetchDocuments()
  }, [])

  const handleEdit = (user) => {
    setUserUpdate(user);
    setOpenForm(true);
  };

  // const handleUpload = (data) => {
  //   console.log("Uploaded:", data);
  //   // API call here
  // };

  const columns = [
    { name: "Service Id", selector: (row, index) => index + 1 },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Service Type",
      selector: (row) => row.service_type,
      sortable: true,
    },
    { name: "Price", selector: (row) => "₹ " + row.price },
    // { name: "Service Type Id", selector: (row) => row.service_type_id },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`ms-2 text-sm font-medium ${row.IsActive ? "text-primary" : "text-red-500"}`}
        >
          {row.IsActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const ServicesUsage = [
    {
      name: "SN",
      selector: (row, index) => index + 1,
      width: "100px",
      sortable: true,
    },
    // {
    //   name: "Service Name",
    //   selector: (row) => row.service_name,
    //   width: "200px",
    //   sortable: true,
    // },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "300px",
    },
    {
      name: "Service Type",
      selector: (row) => row.service_type,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <span
          className={`ms-2 text-xs font-medium uppercase ${row.service_status !== "failed" ? "text-primary" : "text-red-500"}`}
        >
          {row.service_status}
        </span>
      ),
    },
    { name: "Amount", selector: (row) => "₹ " + (row.amount || 0) },
    { name: "Date", selector: (row) => row.created_date?.split(" ")[0] },
    { name: "Time", selector: (row) => row.created_time },
  ];

  const VendorServices = async (code) => {
    // console.log(code);
    
    const req = {
      VendorCode: code,
      url: "Admin/VendorServiceName",
    };

    try {
      const response = await vendorFetchServiceAssignList(req);
      if (response.status) {
        setTableData(response?.getVendorLists);
        // console.log(response?.getVendorLists);
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.error("Error in Fetching User Services : ", error);
    }
  };

  const handleFilterChange = async (range) => {
    // console.log("Filtered Data:", range);
    setDateRange(range);
    // const todayDate = new Date().toLocaleDateString("en-CA");
    const payload = {
      vendor_code: userVendorCode,
      from_date: range.from,
      to_date: range.to,
    };
    const response = await GetVendorServicesUsage(payload);

    if (response.status) {
      // console.log(response);
      setusageHistory(response.data);
    } else {
      setusageHistory([]);
      console.error(response.message);
    }
  };

  const ServicesUsageHistory = async () => {
    const todayDate = new Date().toLocaleDateString("en-CA");

    const payload = {
      vendor_code: userVendorCode,
      from_date: todayDate,
      to_date: todayDate,
    };
    const response = await GetVendorServicesUsage(payload);

    if (response.status) {
      setusageHistory(response.data);
      // console.log(response.dashboardVendors)
    } else {
      setusageHistory([]);
      // console.error(response.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const typeRes = await vendorGetServiceTypeList({
        //   url: "Admin/GetServiceType",
        // });
        // if (typeRes.status) setServicesTypeList(typeRes.serviceTypes);

        const serviceRes = await vendorGetServiceNameTypeList({
          url: "Admin/GetServiceName",
        });
        if (serviceRes.status) setAllServices(serviceRes.serviceNames);

        // console.log(serviceRes.serviceNames);
        
      } catch (error) {
        toast.error("Failed to load services");
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    ServicesUsageHistory();
  }, []);

  const data = [
    {
      name: "User Name",
      value: userDetails?.username,
    },
    {
      name: "Vendor Name",
      value: userDetails?.vendorname,
    },
    {
      name: "Vendor Code",
      value: userDetails?.vendorcode,
    },
    {
      name: "Type",
      value: userDetails?.vendortype,
    },
    {
      name: "Company Name",
      value: userDetails?.companyname,
    },
    {
      name: "Mobile",
      value: userDetails?.mobile,
    },
    {
      name: "Email",
      value: userDetails?.vendoremail,
    },
    {
      name: "Pan Number",
      value: userDetails?.pannumber?.toUpperCase(),
    },
    {
      name: "Address",
      value: userDetails?.officeaddress,
    },
    {
      name: "City",
      value: userDetails?.officecity,
    },
    {
      name: "State",
      value: userDetails?.state,
    },
    {
      name: "Pin Code",
      value: userDetails?.zipcode,
    },
    {
      name: "Token",
      value: userDetails?.Token,
    },
  ];

  useEffect(() => {
    VendorServices(userVendorCode);
  }, []);
  
  
  const filteredData = usageHistory?.filter((s)=> {
    
    const service = s?.description?.toLowerCase()?.replaceAll(" ","")?.includes(selectedService?.toLowerCase().replaceAll(" ", ""));
  
    return service;
  })
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen w-full overflow-hidden mt-12">
        <div className="max-md:px-2 p-6 bg-gray-50 min-h-screen space-y-4">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">{vendor.user}</h1>
              <p className="text-sm text-gray-500">{vendor.email}</p>
            </div>

            <div className="flex gap-2 font-semibold">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg cursor-pointer"
              >
                Back
              </button>
              {!isEmployee && <button
                onClick={() => handleEdit(userDetails)}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 cursor-pointer"
              >
                Edit Vendor
              </button>}
            </div>
          </div>

          {/* STATUS + QUICK INFO */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <InfoCard label="Company" value={vendor.name || "N/A"} />
            <InfoCard label="Phone" value={vendor.phone || "N/A"} />
            <InfoCard label="Type" value={vendor.type} />
            <InfoCard label="Address" value={vendor.address} />
            <InfoCard
              label="Status"
              value={
                <span className={`px-2 py-1 text-xs uppercase rounded-sm  ${vendor.status ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"}`}>
                  {vendor.status ? "Active" : "Inactive"}
                </span>
              }
            />
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-200 bg-white px-3 rounded-md">
            {["details", "Usage History", "services", "documents"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 text-sm font-semibold capitalize transition cursor-pointer ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* TAB CONTENT */}
          <div className="bg-white p-3 md:p-5 rounded-md shadow">
            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                {data?.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="font-bold text-xs uppercase text-gray-500">
                      {item?.name}
                    </label>
                    <span className="bg-gray-100/50 mt-0.5 py-1.5 px-2 rounded-md border-1 border-gray-200 text-sm font-semibold text-gray-500">
                      {" "}
                      {item?.value || "N/A"}{" "}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Usage History" && (
              <div>
                <div className="flex">
                  {isfilter && (
                    <div className="mt-0 w-full max-md:w-full m-auto rounded-md mb-5">
                      <DateFilter
                        setisfilter={setisfilter}
                        onFilterChange={handleFilterChange}
                        allservices={allServices}
                        setselectedService={setselectedService}
                        selectedService={selectedService}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-3 rounded-lg rounded-b-none border border-gray-200 shadow-sm">
                  <div className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                    {dateRange.from} → {dateRange.to}
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setisfilter(!isfilter)}
                      className="px-3 py-1.5 text-xs bg-gray-800 text-white rounded-md hover:opacity-90 font-semibold cursor-pointer"
                    >
                      {isfilter ? "Hide Filter" : "Show Filter"}
                    </button>

                    <CSVLink
                      data={usageHistory}
                      filename={`Services_Usage_History_${userVendorCode}.csv`}
                      className="px-3 py-1.5 text-xs bg-primary text-white rounded-md flex items-center gap-1 shadow-sm font-semibold"
                    >
                      <Icon name="RiFileExcel2Line" size={14} />
                      Export
                    </CSVLink>
                  </div>
                </div>
                <div className="bg-white rounded-lg rounded-t-none border border-gray-200 shadow-sm overflow-hidden">
                  <DataTable
                    columns={ServicesUsage}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {/* SERVICES TAB */}
            {/* {activeTab === "services" && (
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center border p-4 rounded-xl hover:shadow-sm"
              >
                <p className="font-medium">{service.name}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    service.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        )} */}
            {activeTab === "services" && (
              <div className="border-1 border-gray-200">
                <DataTable
                  columns={columns}
                  data={tableData}
                  pagination
                  highlightOnHover
                  striped
                  // progressPending={loading}
                  className="text-sm"
                />
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div>
                <div className="flex justify-end mb-2">
                  <button
                  disabled={isEmployee}
                    onClick={() => setOpen(true)}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-sm text-white font-semibold cursor-pointer text-sm"
                  >
                    Add Documents
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-1">
                  {Documents?.length ? (Documents?.map((doc, index) => (
                    <div
                      key={doc?.id || index}
                      className="flex justify-between items-center border border-gray-200 px-4 py-3 rounded-md hover:shadow-sm"
                    >
                      <div className="flex flex-col">
                        <p className="font-medium">{doc.document_name}</p>
                        <p className="text-xs text-gray-500 font-semibold">
                          {doc?.created_date}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          Uploaded by: {doc?.created_by}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={doc?.file_name}
                          target="_blank"
                          className="text-sm text-primary hover:underline"
                        >
                          View
                        </a>
                        {/* <a href={doc?.file_name} download className="text-sm text-gray-500 hover:text-black cursor-pointer">
                          Download
                        </a> */}
                      </div>
                    </div>
                  ))): 
                  <div className="text-center py-5 font-semibold text-gray-800">No Documents Available</div>
                }
                </div>
              </div>
            )}
          </div>

          <FileUploadModal
            isOpen={open}
            onClose={() => setOpen(false)}
            // onUpload={handleUpload}
            userVendorCode={userVendorCode}
            fetchDocuments={fetchDocuments}
          />

          {openForm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
              <Register
                cancelClose={() => setOpenForm(false)}
                userUpdate={userUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* SMALL REUSABLE COMPONENTS */

const InfoCard = ({ label, value }) => (
  <div className="bg-white py-3 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
      {label}
    </p>
    <p className="font-semibold text-gray-700 mt-1 text-sm break-words">
      {value}
    </p>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);



export default VendorDetails;