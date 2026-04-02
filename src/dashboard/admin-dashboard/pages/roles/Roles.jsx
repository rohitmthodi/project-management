import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddRoles from "./AddRoles";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchRoles = async () => {
    const data = await fetch("http://localhost:3005/roles");
    const convert = await data.json();
    setRoles(convert);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Roles</h2>

        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Role
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <AddRoles
          onClose={() => setShowPopup(false)}
          refreshRoles={fetchRoles}
        />
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">

          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Role Name</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-6 text-gray-500">
                  No Roles Found
                </td>
              </tr>
            ) : (
              roles.map((item) => (
                <tr key={item.id} className="even:bg-gray-100 odd:bg-gray-50">
                  <td className="py-3 px-4 border font-medium">
                    {item.name}
                  </td>

                  <td className="py-3 px-4 border space-x-3">
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Roles;