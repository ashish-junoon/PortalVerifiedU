import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { FiTrendingUp, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { MdLeaderboard } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { vendorGetServiceNameTypeList } from '../../services/Services_API';
import { toast } from "react-toastify";


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const chartBarVariants = {
    hidden: { scaleY: 0 },
    visible: (height) => ({
        scaleY: 1,
        transition: {
            duration: 0.6,
            delay: Math.random() * 0.3,
        },
    }),
};

const dummyChartData = [
    { month: 'Jan', vendors: 45, services: 52, transactions: 38 },
    { month: 'Feb', vendors: 52, services: 48, transactions: 42 },
    { month: 'Mar', vendors: 68, services: 61, transactions: 55 },
    { month: 'Apr', vendors: 72, services: 75, transactions: 68 },
    { month: 'May', vendors: 85, services: 82, transactions: 75 },
    { month: 'Jun', vendors: 92, services: 89, transactions: 88 },
];

const dummyRecentActivities = [
    { id: 1, name: 'Vendor Alpha Corp', action: 'New Registration', status: 'Completed', time: '2 hours ago' },
    { id: 1, name: 'Vendor Fynto', action: 'New Registration', status: 'Completed', time: '2 days ago' },
    { id: 1, name: 'Vendor ABC enterprices', action: 'New Registration', status: 'Completed', time: '2 weeks ago' },
    { id: 2, name: 'Another vendor', action: 'Verification', status: 'Pending', time: '4 years ago' },
];

const dummyTopServices = [
    { name: 'KYC Verification', count: 542, percentage: 32 },
    { name: 'Bank Details', count: 385, percentage: 23 },
    { name: 'Credit Report', count: 298, percentage: 18 },
    { name: 'Payment Gateway', count: 245, percentage: 15 },
    { name: 'Other Services', count: 190, percentage: 12 },
];

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [servicesList, setServicesList] = useState([]);

    // vendor details
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const payload = { url: 'Admin/GetVendorList' };
                const res = await vendorGetServiceNameTypeList(payload);

                if (res.status) {
                    setData(res.getVendorLists);
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
    }, []);   // ONLY updateVendor

    // service details
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // const vendorRes = await vendorGetList();
                // setUsers(vendorRes.getVendorCodes);

                const serviceRes = await vendorGetServiceNameTypeList({
                    url: "Admin/GetServiceName"
                });
                // console.log("service names", serviceRes)
                if (serviceRes.status) setServicesList(serviceRes.serviceNames);

            } catch (error) {
                // toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cardSummary = [
        { label: 'Total Vendors', value: data?.length, change: '+12%', icon: FiUsers, color: 'from-blue-500 to-blue-600' },
        { label: 'Active Vendors', value: data?.filter((item) => item?.isactive)?.length, change: '+8%', icon: FiCheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'Inactive Vendors', value: data?.filter((item) => !item?.isactive)?.length, change: '-5%', icon: FiAlertCircle, color: 'from-amber-500 to-amber-600' },
        { label: 'Available Services', value: servicesList?.length, change: '+23%', icon: FiTrendingUp, color: 'from-purple-500 to-purple-600' },
    ];

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-100 via-slate-0 to-slate-100 mt-10">
                {/* <Navbar /> */}
                <div className="px-6 md:px-10 py-8">

                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4"
                    >
                        <h1 className="text-3xl font-bold text-gray-700">Welcome Back</h1>
                        <p className="text-gray-600">Here's your dashboard overview for today</p>
                    </motion.div>

                    {/* KPI Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2"
                    >
                        {cardSummary.map((stat, index) => {
                            const Icon = stat.icon;
                            const changeIsPositive = stat.change.includes('+');
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="group relative overflow-hidden rounded-lg backdrop-blur-xl bg-white border border-gray-200 p-4 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    {/* Animated gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                                                <Icon size={24} />
                                            </div>
                                            {/* <span className={`text-sm font-semibold ${changeIsPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.change}
                                            </span> */}
                                        </div>
                                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                                        <p className="text-2xl font-bold text-blue-950 flex items-baseline gap-2">
                                            {stat.value}
                                            <span className="text-xs text-gray-600 font-normal"> right now</span>
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Charts Section */}
                    {false && <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-8">
                        {/* Main Chart */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white border border-gray-200 p-8 py-6 hover:border-blue-300 transition-all duration-300 shadow-md"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Vendor Metrics</h2>
                                    <p className="text-gray-600 text-sm">Monthly Vendor Onboards</p>
                                </div>
                                <BsGraphUp className="text-blue-600" size={24} />
                            </div>

                            {/* Bar Chart */}
                            <div className="flex items-end justify-between h-64 gap-3 bg-gray-50 rounded-lg p-2">
                                {dummyChartData.map((data, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                                    >
                                        <div className="flex gap-1 items-end h-full">
                                            {[
                                                { height: (data.vendors / 100) * 100, color: 'bg-green-400', label: 'A' },
                                                { height: (data.services / 100) * 100, color: 'bg-red-400', label: 'I' },
                                            ].map((bar, bidx) => (
                                                <motion.div
                                                    key={bidx}
                                                    custom={bar.height}
                                                    variants={chartBarVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    className={`${bar.color} rounded-t-lg opacity-90 hover:opacity-100 transition-opacity w-3 origin-bottom flex-col`}
                                                    style={{ height: `${bar.height}%` }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-700 font-semibold">{data.month}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <span className="text-gray-600">Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <span className="text-gray-600">Inactive</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Services */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                            className="rounded-2xl backdrop-blur-xl bg-white border border-gray-200 p-8 hover:border-blue-300 transition-all duration-300 shadow-md"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <MdLeaderboard className="text-amber-500" size={24} />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Top Services</h2>
                                    {/* <p className="text-gray-600 text-xs">This month</p> */}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {dummyTopServices.map((service, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700 font-medium text-sm">{service.name}</span>
                                            <span className="text-gray-600 text-xs">{service.count} hits</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${service.percentage}%` }}
                                                transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                            ></motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>}

                    {/* Recent Activities & Summary */}
                    {false && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activities */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.6 }}
                            className="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white border border-gray-200 p-8 hover:border-blue-300 transition-all duration-300 shadow-md"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Onboards</h2>
                            <div className="space-y-3">
                                {dummyRecentActivities.map((activity, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + idx * 0.1 }}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200 hover:border-blue-200 cursor-pointer group"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{activity.name}</p>
                                            <p className="text-xs text-gray-600">{activity.action}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {activity.status}
                                            </span>
                                            <span className="text-xs text-gray-600 whitespace-nowrap">{activity.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Stats Summary */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.7 }}
                            className="rounded-2xl backdrop-blur-xl bg-white border border-gray-200 p-8 hover:border-blue-300 transition-all duration-300 shadow-md"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-400 transition-all">
                                    <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                                    <p className="text-2xl font-bold text-blue-700">$87.2k</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200 hover:border-green-400 transition-all">
                                    <p className="text-gray-600 text-sm mb-1">API Success Rate</p>
                                    <p className="text-2xl font-bold text-green-700">94.5%</p>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 hover:border-red-400 transition-all">
                                    <p className="text-gray-600 text-sm mb-1">API Failed Rate</p>
                                    <p className="text-2xl font-bold text-red-700">5.5%</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-sm text-white font-semibold text-sm"
                                >
                                    View Full Report
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>}
                </div>

            </div>
        </div>
    );
}
