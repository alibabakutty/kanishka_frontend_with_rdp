import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InventoryMaster = () => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    description: "",
    category: "",
    uom: "",
    rateMaster: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Inventory Saved:", formData);
    alert("Inventory Saved!");
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-teal-400 to-slate-300">

      {/* Back Button */}
      <div className="p-4">
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded">
          Back
        </button>
      </div>

      {/* Card */}
      <div className="flex justify-end px-10">
        <div className="w-full max-w-md bg-white rounded shadow-lg p-4">
          
          {/* Card Header */}
          <div className="bg-green-800 text-white text-center font-semibold py-1 mb-4">
            Inventory Master
          </div>

          {/* Form */}
          <div className="space-y-3 text-sm">
            
            <div className="flex items-center">
              <label className="w-40">Item Code :</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Item Name :</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Description :</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Category :</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                autoComplete="off"
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">UOM :</label>
              <input
                type="text"
                name="uom"
                value={formData.uom}
                onChange={handleChange}
                autoComplete="off"
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Rate Master :</label>
              <input
                type="text"
                name="rateMaster"
                value={formData.rateMaster}
                onChange={handleChange}
                autoComplete="off"
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMaster;