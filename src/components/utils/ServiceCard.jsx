import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="py-2 w-full">
      {/* Card Container with fixed height and vertical scroll only */}
      <div className="bg-white rounded-lg shadow-xl w-full h-96 overflow-y-auto overflow-x-auto">
        <table className="w-full table-auto text-gray-800 border-collapse">
          {/* <thead className="bg-gradient-to-r bg-[#0f3c64] to-blue-400 text-white sticky top-0"> */}
          <thead className="bg-gradient-to-r bg-green-900 to-green-700 text-white sticky top-0">
            <tr>
              <th className="px-6 py-2 text-left text-sm font-semibold whitespace-nowrap">
                Service Name
              </th>
              <th className="px-6 py-2 text-left text-sm font-semibold whitespace-nowrap">
                Service Success Count
              </th>
              <th className="px-6 py-2 text-left text-sm font-semibold whitespace-nowrap">
                Service Failed Count
              </th>
              <th className="px-6 py-2 text-left text-sm font-semibold whitespace-nowrap">
                Total Service Charge Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {service &&
              Object.keys(service[0]).map((serviceKey) => {
                return service[0][serviceKey].map((serviceItem, index) => (
                  <tr
                    key={index}
                    className={`border-b transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-green-100/70`}
                  >
                    <td className="px-6 py-2 text-gray-800 font-semibold">{serviceItem.service_name}</td>
                    <td className="px-6 py-2 text-gray-600">{serviceItem.success_count}</td>
                    <td className="px-6 py-2 text-gray-600">{serviceItem.failed_count}</td>
                    <td className="px-6 py-2 text-gray-600">{(serviceItem.success_count * serviceItem.service_amount).toFixed(2)}

                    </td>
                  </tr>
                ));
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceCard;
