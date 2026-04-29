import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatINR } from '../../utils/utils';

const DayBook = () => {
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
      order.totalAmount?.toString().includes(search) ||
      order.companyName?.toLowerCase().includes(search)     // converts number to string for searching
    );
  });
  const [dynamicRows, setDynamicRows] = useState(0);
  const emptyRowsCount = Math.max(0, dynamicRows - filteredOrders.length);
  const containerRef = React.useRef(null);
  const rowRef = React.useRef(null);

  useEffect(() => {
    const calculateRows = () => {
      if (!containerRef.current || !rowRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const rowHeight = rowRef.current.clientHeight;

      const visibleRows = Math.floor(containerHeight / rowHeight);
      setDynamicRows(visibleRows);
    };

    calculateRows();
    window.addEventListener('resize', calculateRows);

    return () => window.removeEventListener('resize', calculateRows);
  }, [filteredOrders]);

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

        const response = await fetch(`${API_URL}/api/v1/purchase-orders/allpo`, {
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
        <h1 className="text-sm font-bold tracking-tight">DayBook</h1>

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
          Purchase Order Voucher Display
        </span>
      </div>

      {/* Table Section */}
      <div ref={containerRef} className="flex-1 overflow-auto">
        <table className="w-full min-w-[1600px] border border-gray-300" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead className="sticky top-0 [&_th]:py-0.5 [&_th]:px-0.5">
            <tr className="bg-[#004d26] text-white text-left  text-[12px]">
              <th className="border border-gray-400 text-center w-12">S. No</th>
              <th className="border border-gray-400 text-center w-60">Voucher Type</th>
              <th className="border border-gray-400 text-center w-36">Voucher No</th>
              <th className="border border-gray-400 text-center w-36">PO No</th>
              <th className="border border-gray-400 text-center w-28">PO Date</th>
              <th className="border border-gray-400 text-center w-92">Party Ledger Name</th>
              <th className="border border-gray-400 text-right w-40">PO Amount</th>
              <th className="border border-gray-400 text-right pr-2 w-24">Created By</th>
              <th className="border border-gray-400 text-right pr-2 w-36">Approved Status</th>
              <th className="border border-gray-400 text-center pr-2 w-104">Company Name</th>
            </tr>
          </thead>


          <tbody className="text-[12px] [&_th]:py-0.5 [&_th]:px-0.5">
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
                const isFirstRow = rowIndex === 0;

                return (
                  <tr
                    ref={isFirstRow ? rowRef : null}
                    key={order.id}
                    onClick={() => navigate(`/update_purchase_order/${order.id}`)}
                    className="cursor-pointer"
                  >
                    {rowData.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`px-1 py-0.5 font-semibold
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
                          } border-[0.5px] border-gray-300`}
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
            {/* Empty Rows */}
            {[...Array(emptyRowsCount)].map((_, i) => (
              <tr key={`empty-${i}`}>
                {Array(10).fill("").map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border-[0.5px] border-gray-300 py-[1.5px]"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody >
          <tfoot className="sticky bottom-0 bg-white z-10">
            <tr>
              {/* Empty cells before Party Ledger Name */}
              <td colSpan={5} className="border border-gray-400"></td>

              {/* Party Ledger Name column */}
              <td className="border border-gray-400 font-semibold text-right pr-2">
                Gross Total :
              </td>

              {/* PO Amount column */}
              <td className="border border-gray-400 font-semibold text-right pr-2">
                {formatINR(grossTotal)}
              </td>

              {/* Remaining columns */}
              <td colSpan={3} className="border border-gray-400"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DayBook;
