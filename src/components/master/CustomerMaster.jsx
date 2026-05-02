import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const CustomerMaster = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    sundryCreditorName: "",
    parentName: "",
    grandParentName: ""
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
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API_URL}/api/v1/accounting-masters/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        console.log("Response:", response.data);

        if (response.data) {
          setFormData({
            sundryCreditorName: response.data.sundryCreditorName || "",
            parentName: response.data.parentName || "",
            grandParentName: response.data.grandParentName || ""
          });
        }

      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    }
    if (id) {
      fetchCustomers();
    }
  }, [id]);

  const handleCustomerKeyDown = (e, index) => {
    const key = e.key;

    if (key === 'Enter') {
      e.preventDefault();
      
      const nextField = index + 1;

      if (nextField < inputRefs.current.length) {
        inputRefs.current[nextField].focus();
        inputRefs.current[nextField].setSelectionRange(0, 0);
      } else if (e.target.name === 'grandParentName') {
        // Do nothing or handle as needed
        handleSave();
      }
    } else if (key === 'Escape') {
      e.preventDefault();
      navigate(-1);
    }
  }
  
  const handleSave = () => {
    // console.log(formData);
    // alert("Customer Saved!");
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
        <div className=" bg-white rounded shadow-lg w-140 h-40">
          {/* Card Header */}
          <div className="bg-green-800 text-white text-center font-semibold py-1 mb-4">
            Accounting Master
          </div>

          {/* Form */}
          <div className="space-y-3 text-sm">

            <div className="flex items-center">
              <label className="w-40 pl-1">Customer Name :</label>
              <input
                type="text"
                name="sundryCreditorName"
                value={formData.sundryCreditorName}
                ref={(input) => (inputRefs.current[0] = input)}
                onKeyDown={(e) => handleCustomerKeyDown(e, 0)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 h-5 pl-1 mr-1"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 pl-1">Parent :</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                ref={(input) => (inputRefs.current[1] = input)}
                onKeyDown={(e) => handleCustomerKeyDown(e, 1)}
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 h-5 pl-1 mr-1"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 pl-1">Grand Parent :</label>
              <input
                type="text"
                name="grandParentName"
                value={formData.grandParentName}
                ref={(input) => (inputRefs.current[2] = input)}
                onKeyDown={(e) => handleCustomerKeyDown(e, 2)}
                autoComplete="off"
                className="flex-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 h-5 pl-1 mr-1"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMaster;