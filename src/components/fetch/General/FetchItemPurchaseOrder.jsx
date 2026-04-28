import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatINR } from '../../utils/utils';

const FetchItemPurchaseOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const username = localStorage.getItem('username');
    const [filters, setFilters] = useState({
        voucherType: '',
        voucherNumber: '',
        orderNo: '',
        date: '',
        party: '',
        amount: '',
        itemName: '',
        hsn: '',
        gst: '',
        qty: '',
        rate: '',
        uom: '',
        itemAmount: '',
        createdBy: '',
        approvedBy: '',
        companyname:''
    });

    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [focusedCol, setFocusedCol] = useState(0);
    const totalColumns = 17;
    let lastOrderId = null;
    const API_URL = import.meta.env.VITE_API_URL;

    // Flatten inventory entries
    const flattenedOrders = useMemo(() => {
        return orders.flatMap((order) =>
            order.inventoryEntries.map((item) => ({
                ...order,
                itemName: item.itemName,
                hsnCode: item.hsnCode,
                gstPercentage: item.gstPercentage,
                itemUom: item.itemUom,
                billedQty: item.billedQty,
                itemRate: item.itemRate,
                itemAmount: item.itemAmount,
                companyname:item.companyName
            }))
        );
    }, [orders]);

    // Filtering
    const filteredOrders = useMemo(() => {
        return flattenedOrders.filter((order) => {
            const search = searchTerm.toLowerCase();

            const globalMatch =
                !search ||
                Object.values(order).some((val) =>
                    val?.toString().toLowerCase().includes(search)
                );

            const columnMatch =
                (!filters.voucherType || order.voucherType?.toLowerCase().includes(filters.voucherType.toLowerCase())) &&
                (!filters.voucherNumber || order.voucherNumber?.toLowerCase().includes(filters.voucherNumber.toLowerCase())) &&
                (!filters.orderNo || order.orderNo?.toLowerCase().includes(filters.orderNo.toLowerCase())) &&
                (!filters.date || order.voucherDate?.toLowerCase().includes(filters.date.toLowerCase())) &&
                (!filters.party || order.partyLedgerName?.toLowerCase().includes(filters.party.toLowerCase())) &&
                (!filters.amount || order.totalAmount?.toString().includes(filters.amount)) &&
                (!filters.itemName || order.itemName?.toLowerCase().includes(filters.itemName.toLowerCase())) &&
                (!filters.hsn || order.hsnCode?.toLowerCase().includes(filters.hsn.toLowerCase())) &&
                (!filters.gst || order.gstPercentage?.toString().includes(filters.gst)) &&
                (!filters.qty || order.billedQty?.toString().includes(filters.qty)) &&
                (!filters.rate || order.itemRate?.toString().includes(filters.rate)) &&
                (!filters.uom || order.itemUom?.toLowerCase().includes(filters.uom.toLowerCase())) &&
                (!filters.itemAmount || Math.abs(order.itemAmount)?.toString().includes(filters.itemAmount)) &&
                (!filters.createdBy || order.createdBy?.toLowerCase().includes(filters.createdBy.toLowerCase())) &&
                (!filters.approvedBy || order.approvedBy?.toLowerCase().includes(filters.approvedBy.toLowerCase()))&&
                (!filters.companyname || order.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()));

            return globalMatch && columnMatch;
        });
    }, [flattenedOrders, searchTerm, filters]);

    useEffect(() => {
        setFocusedIndex(0);
    }, [searchTerm, filters]);

    // Keyboard Navigation
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') {
                navigate(-1);
                return;
            }

            if (filteredOrders.length === 0) return;

            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                        prev < filteredOrders.length - 1 ? prev + 1 : prev
                    );
                    break;
                }
                    

                case 'ArrowUp': {
                    e.preventDefault();
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                }
                    

                case 'ArrowRight': {
                    e.preventDefault();
                    setFocusedCol((prev) =>
                        prev < totalColumns - 1 ? prev + 1 : prev
                    );
                    break;
                }
                    

                case 'ArrowLeft': {
                    e.preventDefault();
                    setFocusedCol((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                }
                    

                case 'Enter': {
                    const selected = filteredOrders[focusedIndex];
                    if (selected) {
                        navigate(`/update_purchase_order/${selected.id}`);
                    }
                    break;
                }
                    

                default:
                    break;
            }
        },
        [filteredOrders, focusedIndex, navigate]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Fetch Data
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API_URL}/api/v1/purchase-orders/generalpo`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const totals = useMemo(() => {
        return filteredOrders.reduce(
            (acc, order) => {
                acc.qty += Number(order.billedQty) || 0;
                acc.amount += Number(order.itemAmount) || 0;
                return acc;
            },
            { qty: 0, amount: 0 }
        );
    }, [filteredOrders]);

    const isFilterApplied = useMemo(() => {
        return (
            searchTerm.trim() !== '' ||
            Object.values(filters).some((val) => val.trim() !== '')
        );
    }, [searchTerm, filters]);

    useEffect(() => {
        const el = document.querySelector(
            `[data-row="${focusedIndex}"][data-col="${focusedCol}"]`
        );
        el?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest'
        });
    }, [focusedIndex, focusedCol]);



    if (loading) return <div className="p-4 text-center">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">Error: {error}</div>;

    return (
        <div className="h-screen flex flex-col bg-white text-sm">
            {/* Navbar */}
            <nav className="bg-[#003366] text-white px-4 py-1 flex justify-between">
                <h1 className="text-sm font-bold">PURCHASE ORDER - GENERAL</h1>
                <div>{username} | Logout</div>
            </nav>

            {/* Search */}
            <div className="bg-gray-100 p-1 flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-green-700 text-white px-3 py-1"
                >
                    ← Esc
                </button>

                <button
                    onClick={() => {
                        setShowFilters(prev => {
                            if (prev) {
                                // clearing filters when hiding
                                setFilters({
                                    voucherType: '',
                                    voucherNumber: '',
                                    orderNo: '',
                                    date: '',
                                    party: '',
                                    amount: '',
                                    itemName: '',
                                    hsn: '',
                                    gst: '',
                                    qty: '',
                                    rate: '',
                                    uom: '',
                                    itemAmount: '',
                                    createdBy: '',
                                    approvedBy: '',
                                    companyname:''
                                });
                            }
                            return !prev;
                        });
                    }}
                    className="bg-cyan-700 text-white px-3 py-1"
                >
                    {showFilters ? 'Hide Filter' : 'Advance Filter'}
                </button>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-2"
                />
            </div>

            {/* ✅ Horizontal Scroll Wrapper */}
            <div className="flex-1 overflow-auto">
                <table className=" border-collapse min-w-600 border border-gray-400 ">
                    {/* Sticky Header */}
                    <thead className="sticky top-0 text-[12px] [&_th]:py-0.5 [&_th]:px-0.5">
                        <tr className="bg-green-800 text-white text-[12px] text-center">
                            <th className="border border-gray-400 w-9">S.No</th>
                            <th className="border border-gray-400 w-52">Voucher Type</th>
                            <th className="border border-gray-400 w-32">Voucher No</th>
                            <th className="border border-gray-400 w-32">PO No</th>
                            <th className="border border-gray-400 w-28 ">PO Date</th>
                            <th className="border border-gray-400 w-100">Party Ledger Name</th>
                            <th className="border border-gray-400 w-28 ">PO Amount</th>
                            <th className="border border-gray-400 w-100">Item Name</th>
                            <th className="border border-gray-400 w-20">HSN</th>
                            <th className="border border-gray-400 w-12">GST %</th>
                            <th className="border border-gray-400 w-12">Qty</th>
                            <th className="border border-gray-400 w-28 ">Rate</th>
                            <th className="border border-gray-400 w-12">UOM</th>
                            <th className="border border-gray-400 w-24">Amount</th>
                            <th className="border border-gray-400 w-20">Created By</th>
                            <th className="border border-gray-400 w-40">Approved Status</th>
                            <th className="border border-gray-400 w-90">Company Name</th>
                        </tr>

                        {/* Filters */}
                        {showFilters && (
                            <tr className="bg-gray-200">
                                <th className='border border-gray-400 px-1 py-1 '></th>
                                {Object.keys(filters).map((key) => (
                                    <th key={key}>
                                        <input
                                            className="text-[12px] outline-0 border border-transparent focus:border focus:border-blue-400 focus:bg-amber-200 bg-transparent w-full pl-1 capitalize"
                                            value={filters[key]}
                                            onChange={(e) =>
                                                setFilters({ ...filters, [key]: e.target.value })
                                            }
                                            placeholder="type..."
                                        />
                                    </th>
                                ))}
                            </tr>
                        )}
                    </thead>

                    <tbody className='text-[12px] [&_th]:py-1 [&_th]:px-1'>
                        {filteredOrders.map((order, rowIndex) => {
                            const isSameOrder = lastOrderId === order.id;
                            lastOrderId = order.id;

                            const rowData = [
                                rowIndex + 1,
                                order.voucherType,
                                order.voucherNumber,
                                order.orderNo,
                                formatDate(order.voucherDate),
                                order.partyLedgerName,
                                isSameOrder ? '' : formatINR(order.totalAmount),
                                order.itemName,
                                order.hsnCode,
                                `${order.gstPercentage}%`,
                                order.billedQty.toFixed(2),
                                formatINR(order.itemRate),
                                order.itemUom,
                                formatINR(Math.abs(order.itemAmount)),
                                order.createdBy,
                                order.approvedBy,
                                order.companyname
                            ];

                            return (
                                <tr
                                    key={rowIndex}
                                    onClick={() =>
                                        navigate(`/update_purchase_order/${order.id}`)
                                    }
                                    className="cursor-pointer font-semibold"
                                >
                                    {rowData.map((cell, colIndex) => (
                                        <td
                                            // key={colIndex}
                                            data-row={rowIndex}
                                            data-col={colIndex}
                                            className={`
                            border border-gray-300 px-1
                            ${focusedIndex === rowIndex && focusedCol === colIndex
                                                    ? 'bg-yellow-200 border border-black'
                                                    : focusedIndex === rowIndex
                                                        ? 'bg-yellow-100'
                                                        : rowIndex % 2 === 0
                                                            ? 'bg-yellow-50'
                                                            : ''
                                                }
                            ${colIndex === 0 || colIndex === 1 || colIndex === 4 || colIndex === 5 || colIndex === 7 || colIndex === 8 || colIndex === 9 || colIndex === 12
                                                    ? 'text-left pl-2'
                                                    : 'text-right'
                                                }
                        `}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* 🔥 Sticky Bottom Footer */}
            <div className=" text-black px-1 py-1 flex justify-between items-center sticky bottom-0 border border-gray-400 ">

                <div className="flex items-center">

                    {/* Empty space */}
                    <div className=" text-right font-semibold">
                        Total:
                    </div>

                    {/* Qty Total */}
                    <div className="text-right font-semibold ml-265">
                        {isFilterApplied ? totals.qty.toFixed(2) : ''}
                    </div>

                    {/* Skip Rate + UOM */}
                    <div className=""></div>

                    {/* Amount Total */}
                    <div className="text-right font-bold ml-30">
                        {isFilterApplied ? formatINR(Math.abs(totals.amount)) : ''}
                    </div>

                    <div className="col-span-2"></div>

                </div>

            </div>
        </div>
    );
};

export default FetchItemPurchaseOrder;
