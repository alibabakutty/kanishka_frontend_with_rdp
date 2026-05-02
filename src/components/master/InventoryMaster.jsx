import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL  = import.meta.env.VITE_API_URL;

const InventoryMaster = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    itemName: "",
    itemUom: "",
    hsnCode: "",
    gstPercentage: "",
    itemRate: ""
  });
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      inputRefs.current[0].setSelectionRange(0, 0);
    }
  }, []);

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
            itemUom: response.data.itemUom || "",
            hsnCode: response.data.hsnCode || "",
            gstPercentage: response.data.gstPercentage || "",
            itemRate: response.data.itemRate || ""
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

  const handleInventoryKeyDown = (e, index) => {
    const key = e.key;

    if (key === 'Enter') {
      e.preventDefault();

      const nextField = index + 1;

      if (nextField < inputRefs.current.length) {
        inputRefs.current[nextField].focus();
        inputRefs.current[nextField].setSelectionRange(0, 0);
      } else if (inputRefs.current.length - 1){
        handleSave();
      }
    } else if (key === 'Escape') {
      e.preventDefault();
      navigate(-1);
    }
  }

  const handleSave = () => {
    // console.log("Inventory Saved:", formData);
    // alert("Inventory Saved!");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-teal-400 to-slate-300 flex">
      {/* Back Button */}
      <div>
        <button onClick={() => navigate(-1)} className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded">
          Back
        </button>
      </div>

      {/* Card */}
      <div className="min-h-screen bg-linear-to-r from-teal-400 to-slate-300 flex justify-end items-start p-4">
        <div className="bg-white rounded shadow-lg w-88 h-56">
          {/* Card Header */}
          <div className="bg-green-800 text-white text-center font-semibold py-1 mb-4">
            Inventory Master
          </div>

          {/* Form */}
          <div className="space-y-3 text-sm">

            <div className="flex items-center">
              <label className="w-28 pl-1">Item Name :</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                ref={(input) => (inputRefs.current[0] = input)}
                onKeyDown={(e) => handleInventoryKeyDown(e, 0)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 h-5 pl-1 mr-1"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-28 pl-1">UOM :</label>
              <input
                type="text"
                name="itemUom"
                value={formData.itemUom}
                ref={(input) => (inputRefs.current[1] = input)}
                onKeyDown={(e) => handleInventoryKeyDown(e, 1)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 h-5 pl-1 mr-1 capitalize"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-28 pl-1">HSN :</label>
              <input
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                ref={(input) => (inputRefs.current[2] = input)}
                onKeyDown={(e) => handleInventoryKeyDown(e, 2)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 h-5 pl-1 mr-1 capitalize"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-28 pl-1">GST :</label>
              <input
                type="text"
                name="gstPercentage"
                value={formData.gstPercentage}
                ref={(input) => (inputRefs.current[3] = input)}
                onKeyDown={(e) => handleInventoryKeyDown(e, 3)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 h-5 pl-1 mr-1 capitalize"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-28 pl-1">Rate :</label>
              <input
                type="text"
                name="itemRate"
                value={formData.itemRate}
                ref={(input) => (inputRefs.current[4] = input)}
                onKeyDown={(e) => handleInventoryKeyDown(e, 4)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28 h-5 pl-1 mr-1 capitalize"
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