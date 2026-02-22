import { FiBell, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white shadow-md px-6 py-3">
      <h2 className="text-xl font-semibold text-gray-700"></h2>

      <div className="flex items-center gap-4">
        <FiBell className="text-gray-600 w-5 h-5 cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-700">John Doe</span>
        </div>
      </div>
    </div>
  );
}
