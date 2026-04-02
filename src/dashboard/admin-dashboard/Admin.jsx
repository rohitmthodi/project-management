import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 p-4 overflow-auto bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;