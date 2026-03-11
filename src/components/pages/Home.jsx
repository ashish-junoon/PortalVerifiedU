import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Background from "../utils/Background";
import UserCard from "../utils/UserCard";
import ServiceCard from "../utils/ServiceCard";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Sidebar";
import { useSidebar } from "../Context/SidebarContext";
import Dashcards from "../utils/Dashcards";
import DashboardCharts from "../utils/DashboardCharts";
function Home() {
  const { isOpenSidebar } = useSidebar();
  const { wallet, vendorDetails, serviceHistory } = useContext(AuthContext);
  const [alertStatus, setAlertStatus] = useState(true);
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
  const totals = serviceHistory
    ?.flatMap((vendor) => Object.values(vendor))
    ?.flat()
    ?.reduce(
      (acc, item) => {
        acc.success_count += item.success_count;
        acc.failed_count += item.failed_count;
        acc.total_services += 1;

        return acc;
      },
      { success_count: 0, failed_count: 0, total_services: 0 },
    );

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

        <div className={`${isOpenSidebar && "lg:ml-64"} md:px-6 flex-1`}>
          {wallet < 100 && (
            <div className="animate-pulse bg-red-100 w-full mt-2 border-l-4 border-l-red-500 flex items-center justify-between pr-6">
              <p className="pl-2 py-2 text-red-600 font-semibold">
                Your Credit Balance is less than ₹ 100, Please recharge your
                wallet.
              </p>

              {/* <p className="cursor-pointer text-xl" onClick={()=> setAlertStatus(false)}>x</p> */}
            </div>
          )}

          <div className="my-3">
            <div className="bg-white md:py-4 px-2 py-6 shadow-xs w-full max-md:w-full m-auto rounded-md">
              <Dashcards wallet={wallet} service={totals} />
            </div>

            {/* <div className="my-5 px-2">
              <DashboardCharts data={serviceHistory} />
            </div> */}

            <div className=" bg-gray-100 md:px-6 md:py-3 px-3 py-3 rounded-xl">
              <h1 className="text-2xl font-bold text-gray-800">Services</h1>

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
