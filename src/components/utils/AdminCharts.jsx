import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardChart({ chartsdata}) {
  const data = [
    { name: "Total Vendors", value: chartsdata[0].value },
    { name: "Active", value: chartsdata[1].value },
    { name: "Inactive", value: chartsdata[2].value },
    { name: "Services", value: chartsdata[3].value },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Overview
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          
          <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />

          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#1dcd9f"   // ✅ your primary color
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}









// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function DashboardChart({ chartsdata = [] }) {
  
//   const data = [
//     { name: "Total Vendors", value: chartsdata?.[0]?.value || 0 },
//     { name: "Active", value: chartsdata?.[1]?.value || 0 },
//     { name: "Inactive", value: chartsdata?.[2]?.value || 0 },
//     { name: "Services", value: chartsdata?.[3]?.value || 0 },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <h2 className="text-lg font-semibold mb-4 text-gray-700">
//         Overview
//       </h2>

//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
          
//           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

//           <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
//           <YAxis tick={{ fill: "#6b7280" }} />

//           <Tooltip
//             contentStyle={{
//               borderRadius: "10px",
//               border: "none",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}
//           />

//           <Bar
//             dataKey="value"
//             fill="#1dcd9f"
//             radius={[8, 8, 0, 0]} // rounded bars
//             barSize={40}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }






// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";

// export default function DashboardChart({ chartsdata = [] }) {

//   const labels = ["Total Vendors", "Active", "Inactive", "Services"];

//   const data = labels.map((label, index) => ({
//     name: label,
//     value: chartsdata?.[index]?.value || 0,
//   }));

//   const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

//   const total = data.reduce((acc, item) => acc + item.value, 0);

//   // Custom label (name + %)
//   const renderLabel = ({ name, percent }) =>
//     `${name} ${(percent * 100).toFixed(0)}%`;

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full">
      
//       {/* Header */}
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Overview
//       </h2>

//       <div className="relative w-full h-[280px]">

//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               innerRadius={70}
//               outerRadius={100}
//               paddingAngle={3}
//               dataKey="value"
//               labelLine={false}
//               label={renderLabel}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={index}
//                   fill={COLORS[index]}
//                   className="hover:opacity-80 transition"
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Center Total */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//           <h3 className="text-2xl font-bold text-gray-800">
//             {total}
//           </h3>
//           <p className="text-xs text-gray-400">Total</p>
//         </div>

//       </div>
//     </div>
//   );
// }