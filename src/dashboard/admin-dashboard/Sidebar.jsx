import React, { useEffect } from "react";
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

  console.log("Current user role:", role); // Debug log

  // Filter items based on role
  const filteredItems = adminDashboardItems.filter((item) => {
    // Admin sees everything except Dashboard
    if (role === "Admin") {
      if (item.permission === "dashboard") return false;
      return true; // Admin sees all other items (Roles, Employees, Projects, Tasks)
    }
    
    // For non-Admin users (Employee, Sub Admin, etc.)
    // Only show Projects and Tasks
    if (item.permission === "projects") return true;
    if (item.permission === "tasks") return true;
    
    return false;
  });

  console.log("Filtered items:", filteredItems.map(i => i.title)); // Debug log

  // Set default redirect based on role
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If user is on /admin or /admin/dashboard, redirect to default page
    if (currentPath === "/admin" || currentPath === "/admin/dashboard") {
      if (role === "Admin") {
        navigate("/admin/roles", { replace: true });
      } else {
        navigate("/admin/projects", { replace: true });
      }
    }
  }, [location.pathname, role, navigate]);

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

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
            const isActive = isActivePath(item.path);

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-500 hover:bg-blue-100 hover:text-blue-700"
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
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
            ${
              location.pathname.startsWith("/admin/account")
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-500 hover:bg-blue-100 hover:text-blue-700"
            }`}
        >
          <MdAccountCircle size={18} />
          <p>Account</p>
        </Link>

        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
            ${
              location.pathname.startsWith("/admin/settings")
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-500 hover:bg-blue-100 hover:text-blue-700"
            }`}
        >
          <IoSettingsSharp size={18} />
          <p>Settings</p>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100 font-medium transition-all"
        >
          <FaSignOutAlt size={18} />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;