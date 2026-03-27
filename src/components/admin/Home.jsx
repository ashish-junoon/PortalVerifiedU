
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UserAssign from "./pages/UserAssign";


function AdminHome() {
  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen w-full mt-10"> 
        {/* <Navbar /> */}
        <UserAssign />
      </div>
    </div>
  );
}

export default AdminHome;
