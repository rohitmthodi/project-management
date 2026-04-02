import React from "react";
import { FaSearch, FaBell, FaQuestionCircle, FaUserCircle, FaUserPlus } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full h-fit px-6 py-3 bg-gray-100">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-15">

        <p className="font-bold bg-cyan-200 text-cyan-700 px-6 py-1 rounded">Admin Dashboard</p>

        {/* Menu Buttons */}
        <div className="hidden md:flex gap-10 text-gray-500 font-medium">
          <button className="hover:text-blue-700 cursor-pointer">Overview</button>
          <button className="hover:text-blue-700 cursor-pointer">Analytics</button>
          <button className="hover:text-blue-700 cursor-pointer">Reports</button>
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">

        {/* Icons */}
        <FaBell className="text-gray-600 text-lg cursor-pointer hover:text-black" />
        <FaQuestionCircle className="text-gray-600 text-lg cursor-pointer hover:text-black" />
        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />

      </div>
    </div>
  );
};

export default Navbar;