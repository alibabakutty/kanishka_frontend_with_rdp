import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatINR } from '../../utils/utils';

const FetchPurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const navigate = useNavigate();
  const [focusedCol, setFocusedCol] = useState(0);
  const totalColumns = 10;
  const API_URL = import.meta.env.VITE_API_URL;
  const username = localStorage.getItem('username');

  // filter logic
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    return (
      order.orderNo?.toLowerCase().includes(search) ||
      order.voucherDate?.toLowerCase().includes(search) ||
      order.partyLedgerName?.toLowerCase().includes(search) ||
      order.voucherType?.toLowerCase().includes(search) ||
      order.totalAmount?.toString().includes(search)   ||    // converts number to string for searching
      order.companyName?.toLowerCase().includes(search)       // converts number to string for searching
    );
  });

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      navigate(-1);
      return;
    }

    if (filteredOrders.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOrders.length - 1 ? prev + 1 : prev
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
        const selectedOrder = filteredOrders[focusedIndex];
        if (selectedOrder) {
          navigate(`/update_purchase_order/${selectedOrder.id}`);
        }
        break;
      }
      default:
        break;
    }
  }, [filteredOrders, focusedIndex, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // retrieve the token you stored during login(usually in localstorage)
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/v1/purchase-orders/generalpo`, {
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
         setOrders(data);
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const grossTotal = filteredOrders.reduce(
    (sum, order) => sum + (Number(order.totalAmount) || 0),
    0
  );

  useEffect(() => {
    const el = document.querySelector(
      `[data-row="${focusedIndex}"][data-col="${focusedCol}"]`
    );

    el?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest'
    });
  }, [focusedIndex, focusedCol]);

  if (loading) return <div className='p-4 text-center'>Loading orders...</div>;
  if (error) return <div className='p-4 text-red-500 text-center'>Error: {error}</div>

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-xs">
      {/* Top Blue Navbar */}
      <nav className="bg-[#003366] text-white px-1 py-1 flex justify-between items-center">
        <h1 className="text-sm font-bold tracking-tight">PURCHASE ORDER - GENERAL</h1>

        <div className="flex items-center gap-6">
          {/* <button className="bg-[#e63946] px-4 py-1 rounded flex items-center gap-2 font-semibold uppercase text-xs">
            <span className="bg-white text-[#e63946] rounded-sm px-0.5">■</span> ADMINISTRATOR
          </button> */}
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
          Purchase Order Voucher Display
        </span>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
         <thead className="bg-[#004d26] text-white text-left [&_th]:px-[0.5] [&_th]:py-1 [&_th]:border [&_th]:border-gray-500">
          <tr>
            <th className="text-center">S. No</th>
            <th className="text-center">Voucher Type</th>
            <th className="text-center">Voucher No</th>
            <th className="text-center">PO No</th>
            <th className="text-center">PO Date</th>
            <th className="text-center">Party Ledger Name</th>
            <th className="text-center">PO Amount</th>
            <th className="text-center">Created By</th>
            <th className="text-center">Approved Status</th>
            <th className="text-center">Company Name</th>
          </tr>
        </thead>

          <tbody  className="[&_th]:px-1 [&_th]:py-1 [&_th]:border [&_th]:border-gray-500" >
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, rowIndex) => {
                const rowData = [
                  rowIndex + 1,
                  order.voucherType,
                  order.voucherNumber,
                  order.orderNo,
                  formatDate(order.voucherDate),
                  order.partyLedgerName,
                  formatINR(order.totalAmount),
                  order.createdBy,
                  order.approvedBy,
                  order.companyName
                ];

                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/update_purchase_order/${order.id}`)}
                    className="cursor-pointer"
                  >
                    {rowData.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`
                    border border-gray-200 px-1 py-0.5 font-semibold
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
          </tbody>
         {/* {grossTotal !=0 &&(
          <tfoot >
            <tr className="bg-[#003366] text-white px-4 py-2  justify-between items-center sticky bottom-0">
              <th className="border border-gray-400 text-center"></th>
              <th className="border border-gray-400 text-center"></th>
              <th className="border border-gray-400 text-center text-[13px]">Grand Total</th>
              <th className="border border-gray-400 text-center"></th>
              <th className="border border-gray-400 text-center"></th>
              <th className="border border-gray-400 text-center"></th>
              <th className="border border-gray-400 text-right pr-2 text-[13px]">{formatINR(grossTotal)}</th>
              <th className="border border-gray-400 text-right pr-2"></th>
              <th className="border border-gray-400 text-right pr-2"></th>
              <th className="border border-gray-400 text-center pr-2"></th>
            </tr>
          </tfoot>
          )}*/}
        </table>
      </div>

      {/* 🔥 Sticky Bottom Footer */}
     <div className=" text-black px-1 py-1 flex justify-between items-center sticky bottom-0 border border-gray-400 ">

        <div className="font-semibold text-[14px] border-solid ">
          Gross Total :
          <span className='ml-145'>
            {formatINR(grossTotal)}
          </span>
        </div>

      </div>
    </div>
  );
};

export default FetchPurchaseOrder;
