import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DashboardCharts = ({ data }) => {

  const apiData = data?.[0] || {};
  const services = Object.values(apiData)?.map((item) => item[0]);

  const totalSuccess = services?.reduce((sum, s) => sum + (s?.success_count || 0), 0);
  const totalFailed = services?.reduce((sum, s) => sum + (s?.failed_count || 0), 0);

  const total = totalSuccess + totalFailed;

  const successPercent = total ? ((totalSuccess / total) * 100)?.toFixed(1) : 0;
  const failedPercent = total ? ((totalFailed / total) * 100)?.toFixed(1) : 0;

  const donutData = [
    { name: "Success", value: totalSuccess },
    { name: "Failed", value: totalFailed },
  ];

  const barData = services?.map((s) => ({
    name: s?.service_name,
    value: s?.success_count + s?.failed_count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Success vs Failed */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex  border border-gray-200">

        {/* Donut */}
        <div className="relative w-1/2 h-60">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold">{successPercent}%</p>
            <p className="text-gray-500 text-sm">Success</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col justify-center gap-4 w-1/2">

          <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Success
            </div>
            <span className="font-semibold">{successPercent}%</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Failed
            </div>
            <span className="font-semibold">{failedPercent}%</span>
          </div>

        </div>

      </div>

      {/* Service Usage */}
      <div className="bg-white rounded-2xl shadow-md p-6  border border-gray-200">

        <h3 className="font-semibold mb-4 text-gray-700">
          Service Usage
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              label={{ position: "top", fontSize: 12 , fontWeight: 700}}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default DashboardCharts;