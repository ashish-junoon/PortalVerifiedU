import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Background from "../utils/Background";
import UserCard from "../utils/UserCard";
import ServiceCard from "../utils/ServiceCard";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import { useSidebar } from "../Context/SidebarContext";
import Dashcards from "../utils/Dashcards";
import DateFilter from "../utils/DateFilter";
import DashboardCharts from "../utils/DashboardCharts";
import { GetServicesUses } from "../services/Services_API";
function Home() {
  const { isOpenSidebar } = useSidebar();
  const { wallet, vendorDetails, serviceHistory, totalserviceHistory, setServiceHistory } =
    useContext(AuthContext);
  const [alertStatus, setAlertStatus] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [isfilter, setisfilter] = useState(false);
  const token = JSON.parse(localStorage.getItem("authData"));
  

  useEffect(() => {
    if (!token?.data?.vendorLogin?.token && !token?.data?.Status) {
      window.location.href = "/login";
    }
  }, [token]);

  const services = Object.values(serviceHistory?.[0] || {}).flat();

  const tillused = services.reduce(
    (sum, item) => sum + (item.success_count || 0) * (item.service_amount || 0),
    0,
  );
  
  const totals = serviceHistory?.reduce(
  (acc, item) => {
    acc.success_count += item?.success_count || 0;
    acc.failed_count += item?.failed_count || 0;
    // acc.total_services = totalserviceHistory?.length;
    acc.total_amount += item?.service_amount || 0;
    acc.assign_amount += item?.service_assign_amt || 0;

    return acc;
  },
  {
    success_count: 0,
    failed_count: 0,
    total_services: totalserviceHistory?.length,
    total_amount: 0,
    assign_amount: 0,
  }
);

  const handleFilterChange = async (range) => {
    console.log("Filtered Data:", range);
    setDateRange(range);
    // const todayDate = new Date().toLocaleDateString("en-CA");
    const payload = {
      from_date: range.from,
      to_date: range.to,
    };
    const response = await GetServicesUses(payload);

    if (response.status === true) {
      setServiceHistory(response.dashboardVendors);
    } else {
      console.error(response.message);
    }
  };

  // const services = {
  //     users: {
  //         name: vendorDetails?.vendorname,
  //         email: vendorDetails?.vendoremail,
  //         avatar: "https://i.pravatar.cc/150?img=1",
  //     },
  //     serviceMaster: [
  //         {
  //             id: 1,
  //             name: "Cibil",
  //             servicesType: "Credit",
  //             description: "Cibil score check for individuals",
  //             price: 10,
  //         },
  //         {
  //             id: 2,
  //             name: "PAN Verification",
  //             servicesType: "KYC",
  //             description: "Verify PAN card information instantly",
  //             price: 9,
  //         },
  //         {
  //             id: 3,
  //             name: "Equifax",
  //             servicesType: "Credit",
  //             description: "Credit report and scoring from Equifax",
  //             price: 5,
  //         },

  //     ],
  // };

  return (
    <div>
      <Helmet>
        <title>VerifiedU: Dashboard</title>
      </Helmet>
      <Background />
      <div className="lg:flex">
        {isOpenSidebar && <Sidebar />}

        <div className={`${isOpenSidebar && "lg:ml-64"} px-2 md:px-6 flex-1 bg-gradient-to-br from-slate-100 via-slate-0 to-slate-100`}>
          {wallet < 100 && (
            <div className="animate-pulse bg-red-100 w-full mt-2 border-l-4 border-l-red-500 flex items-center justify-between pr-6">
              <p className="pl-2 py-2 text-red-600 font-semibold">
                Your Credit Balance is less than ₹ 100, Please recharge your
                wallet.
              </p>
            </div>
          )}

          <div className="py-3">
            <h1 className="text-xl font-bold text-gray-700">Welcome Back</h1>
            <p className="text-gray-600 text-sm font-medium">
              Here's your dashboard overview for selected Date
            </p>

            <div className="max-md:py-0 mt-4 mb-2 w-full max-md:w-full m-auto rounded-md">
              <Dashcards wallet={wallet} service={totals} />
            </div>

            {/* <div className="my-5 px-2">
              <DashboardCharts data={serviceHistory} />
            </div> */}

            <div className="flex">
              {isfilter && (
                <div className="mt-0 w-full max-md:w-full m-auto rounded-md">
                  <DateFilter setisfilter={setisfilter} onFilterChange={handleFilterChange} />
                </div>
              )}
            </div>

            <div className="md:px-0 md:py-2 px-0 py-0 rounded-xl">
              {/* <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Services</h1>
                <p className="text-xs font-semibold">{dateRange.from} to {dateRange.to}</p>
              </div> */}
{/* 
              <div className="flex items-center justify-between flex-wrap gap-2 px-2">
                <h1 className="text-2xl font-bold text-gray-600 font-mono">Services</h1>

                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-gray-100 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700">
                    {dateRange.from} → {dateRange.to}
                  </div>

                  <button
                    onClick={() => setisfilter(!isfilter)}
                    className="cursor-pointer flex items-center gap-1 bg-primary hover:bg-primarydark text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
                  >
                    {isfilter ? "Hide" : "Filter"}
                  </button>
                </div>
              </div> */}

              {/* {serviceHistory?.length === 0 ? (
                <p className="text-gray-500 text-center my-10">
                  No services details available
                </p>
              ) : ( */}
                <div className="">
                  <ServiceCard dateRange={dateRange} setisfilter={setisfilter} isfilter={isfilter} service={serviceHistory} />
                </div>
              {/* )} */}
            </div>
          </div>

          {/* <div className="flex justify-center items-center">
            <div className="bg-white md:p-6 px-2 py-6 shadow-xs  w-[90%] max-md:w-full m-auto rounded-md">
              <h1 className="text-2xl font-bold text-gray-900  mb-2">
                Credit Bureau
              </h1>

              <UserCard vendorDetails={vendorDetails} tillused={tillused} />

              <div className=" bg-gray-100 md:px-8 md:py-1 px-3 py-2">
                <h1 className="text-3xl font-semibold text-gray-800">Services</h1>

                {serviceHistory?.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No services available
                  </p>
                ) : (
                  <div className="">
                    <ServiceCard service={serviceHistory} />
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default Home;
