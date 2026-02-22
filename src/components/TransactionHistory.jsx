import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { GetVendorRechargeHistory } from "./services/Services_API";
// import Loader from "../../utils/Loader";

export default function TransactionHistory({ backButton }) {

    // const [users, setUsers] = useState([]);
    const [transactionsList, setTransactionsList] = useState([]);
    const [filterText, setFilterText] = useState("");

    const [loading, setLoading] = useState(false);


    // -----------------------
    // API CALLS
    // -----------------------

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const transactionHistory = await GetVendorRechargeHistory();
                // console.log(transactionHistory.data)
                setTransactionsList(transactionHistory.data);

            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // helper fx to sort using date/time
    // const parseDate = (dateStr) => {
    //     const [datePart, timePart] = dateStr.split(" ");
    //     const [day, month, year] = datePart.split("/").map(Number);
    //     const [hour, minute, second] = timePart.split(":").map(Number);

    //     return new Date(year, month - 1, day, hour, minute, second).getTime();
    // };


    const columns = [
        {
            name: "#", selector: (row, i) => i + 1,
            width: "60px",
        },
        { name: "Vendor Code", selector: row => row.vendor_code, width: "120px", },
        { name: "Amount", selector: row => "₹ " + row.recharge_amount, width: "80px", },
        { name: "Mode", selector: row => row.recharge_mode, width: "80px", },
        { name: "Transaction Id", selector: row => row.transaction_id, wrap: true, width:"160px" },
        { name: "Date", selector: row => row.recharge_date, sortable: true, wrap: true, },
        {
            name: 'Status',
            cell: row => (
                <span className={`text-sm font-medium ${row.recharge_status == "success" ? 'text-green-800' : 'text-red-800'}`}>
                    {row.recharge_status == "success" ? 'Success' : 'Failure'}
                </span>
            ),
            width: "90px",
        },
    ];

    const filteredData = transactionsList?.filter(item =>
        `${item?.vendor_code} ${item?.recharge_mode} ${item?.transaction_id} ${item?.recharge_amount} ${item?.recharge_status} ${item?.recharge_date}`
            .toLowerCase()
            .includes(filterText.toLowerCase())
    )
    // .sort((a, b) => parseDate(b.recharge_date) - parseDate(a.recharge_date));

    // if (loading) return <Loader message="Getting Report..." color="#63BB89" />
    return (
        <div className="p-0 min-h-screen">

            {/* ========================
                SEARCH FIELD
            ========================== */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Search Box */}
                <div className="relative w-80">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search vendor / service..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>


                {/* Loading */}
                {loading && (
                    <span className="text-blue-600 font-medium">Loading...</span>
                )}
            </div>


            {/* ========================
                TABLE CARD
            ========================== */}
            <div className="bg-white shadow-md rounded-xl">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    className="text-sm"
                    customStyles={
                        {
                            cells: {
                                style: {
                                    paddingTop: "6px",
                                    paddingBottom: "6px",
                                },
                            },
                        }
                    }
                />
            </div>

        </div>
    );
}
