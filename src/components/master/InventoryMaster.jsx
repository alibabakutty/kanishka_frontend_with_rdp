import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL  = import.meta.env.VITE_API_URL;

const InventoryMaster = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    itemName: "",
    uom: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');

        const response =  await axios.get(`${API_URL}/api/v1/inventory-masters/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Response:", response.data);

        if (response.data) {
          setFormData({
            itemName: response.data.itemName || "",
            uom: response.data.uom || ""
          });
        }

      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    }
    if (id) {
        fetchInventory();
    }
  }, [id]);

  const handleSave = () => {
    console.log("Inventory Saved:", formData);
    alert("Inventory Saved!");
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-teal-400 to-slate-300">

      {/* Back Button */}
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded">
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
              <label className="w-40">Item Name :</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">UOM :</label>
              <input
                type="text"
                name="uom"
                value={formData.uom}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 h-5 pl-1"
                autoComplete="off"
                readOnly
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMaster;