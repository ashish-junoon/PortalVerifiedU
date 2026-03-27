import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import Sidebar from "../Sidebar";

export default function Members() {
  const [openForm, setOpenForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [filterText, setFilterText] = useState("");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Rohit",
      email: "rohit@gmail.com",
      role: "Admin",
      pages: ["Dashboard", "Users"],
    },
    {
      id: 2,
      name: "Amit",
      email: "amit@gmail.com",
      role: "User",
      pages: ["Dashboard"],
    },
  ]);

  const filteredData = members?.filter((user)=> {
    const machedUser = user?.name?.toLowerCase()?.includes(filterText);
    const machedEmail = user?.email?.toLowerCase()?.includes(filterText);
    const machedRole = user?.role?.toLowerCase()?.includes(filterText);
    const machedPages = user?.pages?.join("",",")?.toLowerCase()?.includes(filterText);

    return machedUser || machedEmail || machedRole || machedPages;
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    pages: [],
  });

  const roles = ["Admin", "User"];
  const pagesList = ["Dashboard", "Users", "Reports", "Settings"];

  // ---------------- Handle Input ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    setFormData((prev) => {
      const exists = prev.pages.includes(page);
      return {
        ...prev,
        pages: exists
          ? prev.pages.filter((p) => p !== page)
          : [...prev.pages, page],
      };
    });
  };

  // ---------------- Submit ----------------
  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill all required fields");
      return;
    }

    if (editMember) {
      // Update
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editMember.id ? { ...formData, id: m.id } : m
        )
      );
    } else {
      // Add
      setMembers((prev) => [
        ...prev,
        { ...formData, id: Date.now() },
      ]);
    }

    setOpenForm(false);
    setEditMember(null);
    setFormData({ name: "", email: "", role: "", pages: [] });
  };

  // ---------------- Edit ----------------
  const handleEdit = (member) => {
    setEditMember(member);
    setFormData(member);
    setOpenForm(true);
  };

  // ---------------- Table ----------------
  const columns = [
    { name: "Name", selector: (row) => row.name },
    { name: "Email", selector: (row) => row.email },
    { name: "Role", selector: (row) => row.role },
    {
      name: "Pages Access",
      cell: (row) => row.pages.join(", "),
    },
    {
      name: "Action",
      cell: (row) => (
        <button className="text-xl" onClick={() => handleEdit(row)}>
          <FaEdit />
        </button>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen mt-10">
        {/* <Navbar /> */}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Roles Master</h2>
            <button
              onClick={() => {
                setOpenForm(true);
                setEditMember(null);
                setFormData({ name: "", email: "", role: "", pages: [] });
              }}
              className="bg-primary text-white px-4 py-2 rounded cursor-pointer font-semibold"
            >
              + Add Roles
            </button>
          </div>
        
        <div className="w-[300px]">
          <input
            type="text"
            className="border border-gray-300 px-2 py-1 rounded-md bg-white w-full outline-none"
            placeholder="Search service..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        </div>

          <div className="bg-white mt-2 p-4 rounded shadow">
            <DataTable columns={columns} data={filteredData} pagination />
          </div>
        </div>

        {/* Popup Form */}
        {openForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-[500px]">
              <h3 className="text-lg font-semibold mb-4">
                {editMember ? "Edit Member" : "Add Member"}
              </h3>

              <div className="grid grid-cols-3 gap-1">
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />
              
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />
              
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              
              <input
                type="text"
                name="phone"
                placeholder="Department"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />
              
              <input
                type="text"
                name="phone"
                placeholder="Designation"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />
              
              <input
                type="text"
                name="phone"
                placeholder="Password"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              />

              {/* <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mb-0 px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select> */}
              </div>

              {/* Pages Access */}
              {/* <div className="my-3 border-t border-gray-300 py-1">
                <p className="font-medium">Pages Access:</p>
                <div className="grid grid-cols-2">
                    {pagesList.map((page) => (
                  <label key={page} className="block">
                    <input
                      type="checkbox"
                      checked={formData.pages.includes(page)}
                      onChange={() => handlePageChange(page)}
                    />
                    <span className="ml-2">{page}</span>
                  </label>
                ))}
                </div>
              </div> */}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setOpenForm(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 bg-primary text-white rounded"
                >
                  {editMember ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}