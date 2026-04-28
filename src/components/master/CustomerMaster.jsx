import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerMaster = () => {
  const [formData, setFormData] = useState({
    customerCode: "",
    customerName: "",
    email: "",
    region: "",
    salesExecutive: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log(formData);
    alert("Customer Saved!");
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
            Customer Master
          </div>

          {/* Form */}
          <div className="space-y-3 text-sm">
            
            <div className="flex items-center">
              <label className="w-40">Customer Code :</label>
              <input
                type="text"
                name="customerCode"
                value={formData.customerCode}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                  
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Customer Name :</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Email :</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Region :</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                autoComplete="off"
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Sales Executive :</label>
              <input
                type="text"
                name="salesExecutive"
                value={formData.salesExecutive}
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

export default CustomerMaster;