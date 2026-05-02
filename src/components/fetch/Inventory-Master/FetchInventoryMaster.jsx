import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Title from "../../utils/Title";
import Header from "../../utils/Header";
import VoucherSub from "../../utils/VoucherSub";
import Footer from "../../utils/Footer";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { formatDate, formatINR } from "../../utils/utils";

const FetchInventoryMaster = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const navigate = useNavigate();
  const [focusedCol, setFocusedCol] = useState(0);
  const totalColumns = 3;
  const username=localStorage.getItem('username');
  const API_URL = import.meta.env.VITE_API_URL;

  // filter logic
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.itemName?.toLowerCase().includes(search) ||
      customer.itemUom?.toLowerCase().includes(search) ||
      customer.hsnCode?.toLowerCase().includes(search) ||
      customer.gstPercentage?.toString().toLowerCase().includes(search) ||
      customer.itemRate?.toString().toLowerCase().includes(search)
    );
  });
  const [dynamicRows, setDynamicRows] = useState(0);
  const emptyRowsCount = Math.max(0, dynamicRows - filteredCustomers.length);
  const containerRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const calculateRows = () => {
      if (!containerRef.current || !rowRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const rowHeight = rowRef.current.clientHeight;

      const visibleRows = Math.floor(containerHeight / rowHeight);
      setDynamicRows(visibleRows);
    }
    calculateRows();
    window.addEventListener('resize', calculateRows);
    return () => window.removeEventListener('resize', calculateRows);
  }, [filteredCustomers]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      navigate(-1);
      return;
    }

    if (filteredCustomers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredCustomers.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;

      case 'ArrowRight':
        e.preventDefault();
        setFocusedCol(prev =>
          prev < totalColumns - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowLeft':
        e.preventDefault();
        setFocusedCol(prev => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter': {
        const selectedCustomer = filteredCustomers[focusedIndex];
        if (selectedCustomer) {
          navigate(`/update_inventory/${selectedCustomer.id}`);
        }
        break;
      }
      default:
        break;
    }
  }, [filteredCustomers, focusedIndex, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // retrieve the token you stored during login(usually in localstorage)
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/v1/inventory-masters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response:', data);
         setCustomers(data);
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const el = document.querySelector(
      `[data-row="${focusedIndex}"][data-col="${focusedCol}"]`
    );

    el?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest'
    });
  }, [focusedIndex, focusedCol]);

  if (loading) return <div className='p-4 text-center'>Loading customers...</div>;
  if (error) return <div className='p-4 text-red-500 text-center'>Error: {error}</div>

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-xs">
      {/* Top Blue Navbar */}
      <nav className="bg-[#003366] text-white px-1 py-1 flex justify-between items-center">
        <h1 className="text-sm font-bold tracking-tight">KANISHKA - Inventory Master</h1>

        <div className="flex items-center gap-6">
          
          <div className="text-sm">
            <span className="font-bold">{username}</span> | <button className="hover:underline">Logout</button>
          </div>
        </div>
      </nav>

      {/* Sub-header / Search Area */}
      <div className="bg-[#f0f0f0] border-b border-gray-300 p-1 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="bg-[#004d26] text-white px-3 py-0.5 rounded text-xs flex items-center gap-1">
          ← Esc
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 border border-gray-400 bg-[#ffffcc] px-2 py-0.5 outline-none focus:border-blue-500"
        />

        <span className="text-[#003366] font-bold text-xs pr-2 italic">
          Inventory Display
        </span>
      </div>

      {/* Table Section */}
      <div ref={containerRef} className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-[#004d26] text-white text-left [&_th]:px-[0.5] [&_th]:py-1 [&_th]:border [&_th]:border-gray-500">
            <tr className="bg-[#004d26] text-white text-left  ">
              <th className="border border-gray-400 text-center">S. No</th>           
              <th className="border border-gray-400 text-center">Item Name</th>
              <th className="border border-gray-400 text-center">UOM</th>
              <th className="border border-gray-400 text-center">HSN</th>
              <th className="border border-gray-400 text-center">GST</th>
              <th className="border border-gray-400 text-center">Rate</th>
            </tr>
          </thead>

          <tbody className="[&_th]:px-1 [&_th]:py-1 [&_th]:border [&_th]:border-gray-500" >
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, rowIndex) => {
                const rowData = [
                  rowIndex + 1,
                  customer.itemName,
                  customer.itemUom,
                  customer.hsnCode,
                  customer.gstPercentage,
                  formatINR(customer.itemRate)
                ];
                const isFirstRow = rowIndex === 0;
                return (
                  <tr
                    ref={isFirstRow ? rowRef : null}
                    key={customer.id}
                    onClick={() => navigate(`/update_inventory/${customer.id}`)}
                    className="cursor-pointer"
                  >
                    {rowData.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`
                    border border-gray-200 px-1 py-0.5 font-semibold capitalize
                    ${focusedIndex === rowIndex && focusedCol === colIndex
                            ? 'bg-yellow-200 border-2 border-black'
                            : focusedIndex === rowIndex
                              ? 'bg-yellow-100'
                              : rowIndex % 2 === 0
                                ? 'bg-[#fffbeb]'
                                : 'bg-white'
                          }
                    ${colIndex === 0 || colIndex === 4
                            ? 'text-center'
                            : colIndex === 6 || colIndex === 7 || colIndex === 8
                              ? 'text-right pr-2'
                              : 'text-left pl-2'
                          }
                  `}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
            {/* Empty rows */}
            {[...Array(emptyRowsCount)].map((_, i) => (
              <tr key={`empty-${i}`}>
                {Array(4).fill("").map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border-[0.5px] border-gray-300 py-[1.5px]"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  </div>
  );
};

export default FetchInventoryMaster;
