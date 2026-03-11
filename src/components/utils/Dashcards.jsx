import Icon from "./Icon";

const Dashcards = ({ wallet, service }) => {
  const dashcards = [
    {
      name: "Credit Balance",
      count: `₹${wallet || 0}`,
      icon: "FaWallet",
    },
    {
      name: "Total services",
      count: service?.total_services || 0,
      icon: "MdMiscellaneousServices",
    },
    {
      name: "Success count",
      count: service?.success_count || 0,
      icon: "MdLibraryAddCheck",
    },
    {
      name: "Failure count",
      count: service?.failed_count || 0,
      icon: "GoAlertFill",
    },
  ];
  


  return (
    <div>
      <div className="grid grid-cols-4 gap-2 max-lg:grid-cols-2">
        {dashcards?.map((item, index) => {
          return (
            <div
              key={index}
              className="shadow-md px-5 py-6 rounded-lg flex items-center justify-between border border-gray-300/60"
            >
              <div>
                <p className="font-bold text-2xl max-md:text-lg text-gray-600">
                  {item?.count}
                </p>
                <p className="text-gray-400 max-md:text-sm">{item?.name}</p>
              </div>
              <div className="bg-primary/20 p-2 rounded-sm max-md:p-1">
                <Icon name={item?.icon} color="#04bd8c" size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashcards;
