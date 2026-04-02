import React from "react";
import { adminDashboardItems } from "../../constants";
import { IoSettingsSharp } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Function to check if role has permission for a menu item
  const hasPermission = (permission) => {
    // Only Admin sees everything
    if (role === "Admin") return true;
    
    // All other roles (Employee, Sub Admin, Manager, etc.) see only these
    if (permission === "dashboard") return true;
    if (permission === "projects") return true;
    if (permission === "tasks") return true;
    
    // Roles and Employees are hidden for non-Admin
    return false;
  };

  // Filter items based on permissions
  const filteredItems = adminDashboardItems.filter((item) =>
    hasPermission(item.permission)
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userPermissions");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen flex flex-col justify-between py-6 px-5 border-r-4 border-gray-200">
      
      {/* TOP */}
      <div>
        <h1 className="mb-10 text-xl font-bold text-center">
          EDU ERP PRO
        </h1>

        <div className="flex flex-col gap-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-500 hover:bg-blue-100"
                  }`}
              >
                {Icon && <Icon size={20} />}
                <p>{item.title}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-1">
        <Link
          to="/admin/account"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium
            ${
              location.pathname.startsWith("/admin/account")
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-500 hover:bg-blue-100"
            }`}
        >
          <MdAccountCircle size={18} />
          <p>Account</p>
        </Link>

        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium
            ${
              location.pathname.startsWith("/admin/settings")
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-500 hover:bg-blue-100"
            }`}
        >
          <IoSettingsSharp size={18} />
          <p>Settings</p>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100 font-medium"
        >
          <FaSignOutAlt size={18} />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;