import React from "react";

const ServiceCard = ({ service, setisfilter, isfilter, dateRange }) => {
  const data = service && service[0] ? Object.values(service[0]).flat() : [];

  return (
    <div className="w-full">
      {/* Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-2 flex justify-between items-start border-b border-gray-200 bg-gray-200">
          <h2 className="text-md font-semibold text-gray-800">
            Service Analytics
          </h2>
          {/* <span className="text-xs text-gray-500">
            Total: {data.length}
          </span> */}
          <div className="flex items-center gap-2 mb-1">
            {/* Date Range */}
            <div className="bg-gray-100 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700">
              {dateRange.from} → {dateRange.to}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setisfilter(!isfilter)}
              className="cursor-pointer flex items-center gap-1 bg-primary hover:bg-primarydark text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              {/* Icon (optional) */}
              {/* 🔍 */}
              {isfilter ? "Hide" : "Filter"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[350px]">
          <table className="w-full text-sm border-separate border-spacing-y-0 px-3 pt-1">
            <thead >
              <tr className="text-gray-500 text-xs uppercase">
                <th className="text-left px-4 py-2 border-b border-gray-300">Service</th>
                {/* <th className="text-left px-4 py-2 border-b border-gray-300">Description</th> */}
                <th className="text-left px-4 py-2 border-b border-gray-300">Success</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Failed</th>
                <th className="text-left px-4 py-2 border-b border-gray-300">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => {
                const revenue = (
                  item.success_count * item.service_amount
                ).toFixed(2);

                const total = item.success_count + item.failed_count;

                return (
                  <tr key={index} className="bg-white transition">
                    {/* Service */}
                    {/* <td className="px-4 py-2.5 border-b border-gray-300/80 font-medium text-gray-700">
                      {item.service_name}
                    </td> */}
                    
                    <td className="px-4 py-2.5 border-b border-gray-300/80 font-medium text-gray-700">
                      {item.description}
                    </td>

                    {/* Success */}
                    <td className="px-4 py-2.5 border-b border-gray-300/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-semibold text-green-600">
                          {item.success_count}
                        </span>
                      </div>
                    </td>

                    {/* Failed */}
                    <td className="px-4 py-2.5 border-b border-gray-300/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="font-semibold text-red-500">
                          {item.failed_count}
                        </span>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-2.5 font-semibold text-gray-700 rounded-r-xl border-b border-gray-300/80">
                      ₹ {revenue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {/* <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
          <span>Showing all services</span>
          <span className="text-primary font-semibold cursor-pointer hover:underline">
            Refresh
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default ServiceCard;
