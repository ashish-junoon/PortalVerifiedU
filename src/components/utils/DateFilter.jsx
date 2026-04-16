import { useState } from "react";
import { toast } from "react-toastify";

const DateFilter = ({ onFilterChange, setisfilter, allservices, setselectedService, selectedService }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [preset, setPreset] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handlePresetChange = (value) => {
    setPreset(value);

    const today = new Date();
    let from = new Date();
    if (value === "today") {
      from = today;
    } else if (value === "15") {
      from.setDate(today.getDate() - 15);
    } else if (value === "30") {
      from.setDate(today.getDate() - 30);
    }

    const formattedFrom = from.toISOString().split("T")[0];
    const formattedTo = today.toISOString().split("T")[0];

    setFromDate(formattedFrom);
    setToDate(formattedTo);

    onFilterChange({ from: formattedFrom, to: formattedTo });
  };

  const handleApply = () => {
    if (!fromDate || !toDate) {
      return toast.warning("Select Proper Date First!");
    }
    setPreset("");
    onFilterChange({ from: fromDate, to: toDate });
  };

  const resetDate = () => {
    setPreset("");
    setFromDate("");
    setToDate("");
    onFilterChange({ from: today, to: today });
    setisfilter(false);
    setselectedService("");
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 px-3 py-2 bg-white shadow border border-gray-200 rounded-md">
      {/* LEFT */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="border border-gray-300/70 rounded-md px-2 py-1 text-sm"
        >
          <option value="">Range</option>
          <option value="today">Today</option>
          <option value="15">15 Days</option>
          <option value="30">30 Days</option>
        </select>

        <input
          type="date"
          value={fromDate}
          max={new Date().toLocaleDateString("en-CA")}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300/70 rounded-md px-2 py-1 text-sm"
        />

        <span className="hidden sm:inline text-gray-400 text-xs">to</span>

        <input
          type="date"
          value={toDate}
          max={new Date().toLocaleDateString("en-CA")}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300/70 rounded-md px-2 py-1 text-sm"
        />
        {allservices && (<select
          value={selectedService}
          onChange={(e) => setselectedService(e.target.value)}
          className="border border-gray-300/70 rounded-md px-2 py-1 text-sm"
        >
          <option value="" >Select Service</option>
          {allservices?.map((item)=> {
            return <option value={item.description} >{item.description}</option>
          })}
        </select>)}
      </div>

      {/* RIGHT */}
      <div className="flex gap-2 w-full lg:w-auto">
        <button
          onClick={handleApply}
          className="flex-1 lg:flex-none bg-primary text-white px-3 py-1.5 text-sm font-semibold cursor-pointer rounded-md hover:opacity-90 transition"
        >
          Apply
        </button>

        <button
          onClick={resetDate}
          className="flex-1 lg:flex-none bg-gray-800 text-white px-3 py-1.5 text-sm font-semibold cursor-pointer rounded-md hover:opacity-90 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
