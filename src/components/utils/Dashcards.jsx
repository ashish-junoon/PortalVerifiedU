import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const Dashcards = ({ wallet, service }) => {
  const navigate = useNavigate();
  console.log(service);
  
  const dashcards = [
    {
      name: "Credit Balance",
      count: `₹${wallet?.toFixed(2) || 0}`,
      icon: "FaWallet",
      gradient: "from-[#1dcd9f] to-[#0ea5e9]",
      view:"/profile"
    },
    {
      name: "Total Services",
      count: service?.total_services || 0,
      icon: "MdMiscellaneousServices",
      gradient: "from-[#6366f1] to-[#8b5cf6]",
    },
    {
      name: "Success Count",
      count: service?.success_count || 0,
      icon: "MdLibraryAddCheck",
      gradient: "from-[#22c55e] to-[#1dcd9f]",
    },
    {
      name: "Failure Count",
      count: service?.failed_count || 0,
      icon: "GoAlertFill",
      gradient: "from-[#ef4444] to-[#f97316]",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 max-lg:gap-1 max-lg:grid-cols-2 max-md:grid-cols-1">
      {dashcards.map((item, index) => (
        <div
          key={index}
           onClick={()=> {item.view && navigate(item?.view)}}
          className="cursor-pointer relative group rounded-2xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-500"
        >
          {/* Inner Card */}
          <div className="bg-white/90 rounded-lg p-3 h-full flex flex-col justify-between relative overflow-hidden border border-gray-200">

            {/* Gradient Glow */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${item.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition`}
            />

            {/* Content */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 tracking-wide">
                  {item.name}
                </p>

                <h2 className="text-xl font-bold text-gray-700 mt-1 transition">
                  {item.count}
                </h2>
              </div>

              {/* Icon */}
              <div
                className={`p-2 max-lg:p-2 rounded-lg bg-gradient-to-r ${item.gradient} text-white shadow-md group-hover:scale-110 transition`}
              >
                <Icon name={item.icon} size={18} />
              </div>
            </div>

            {/* Bottom Line */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>Updated just now</span>
              {item.view && <span className="cursor-pointer text-primary font-semibold group-hover:translate-x-1 transition">
                Recharge →
              </span>}
            </div>

            {/* Hover Border Effect */}
            {/* <div className="absolute inset-0 border border-transparent group-hover:border-primary/40 transition"></div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashcards;