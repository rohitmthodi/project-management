import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa";

const Tasks = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Tasks</h2>

        {/* Add Button */}
        <button 
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Task
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Task Name</th>
              <th className="py-3 px-4 border">Project</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                No Tasks Found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks;