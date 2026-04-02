import React, { useState, useEffect } from "react";
import { FaBell, FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import ProjectNotification from "./ProjectNotification";

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await axios.get("http://localhost:3005/projects");
      let count = 0;
      if (userRole === "Admin") {
        count = res.data.length;
      } else {
        count = res.data.filter(
          (project) => project.employee === loggedInUser?.name
        ).length;
      }
      setNotificationCount(count);
    } catch (error) {
      console.log(error);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
    fetchNotificationCount();
  };

  return (
    <div className="flex justify-between items-center w-full h-fit px-6 py-3 bg-gray-100">
      <div className="flex items-center gap-15">
        <p className="font-bold bg-cyan-200 text-cyan-700 px-6 py-1 rounded">
          {userRole === "Admin" ? "Admin Dashboard" : `${loggedInUser?.name}'s Dashboard`}
        </p>
        <div className="hidden md:flex gap-10 text-gray-500 font-medium">
          <button className="hover:text-blue-700 cursor-pointer">Overview</button>
          <button className="hover:text-blue-700 cursor-pointer">Analytics</button>
          <button className="hover:text-blue-700 cursor-pointer">Reports</button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <FaBell 
            className="text-gray-600 text-lg cursor-pointer hover:text-black" 
            onClick={() => setShowNotification(true)}
          />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        <FaQuestionCircle className="text-gray-600 text-lg cursor-pointer hover:text-black" />
        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />
      </div>

      {showNotification && <ProjectNotification onClose={closeNotification} />}
    </div>
  );
};

export default Navbar;