import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Title from "../utils/Title";
import Header from "../utils/Header";
import VoucherSub from "../utils/VoucherSub";
import Footer from "../utils/Footer";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { formatDate, formatINR } from "../utils/utils";

const PurchaseOrder = () => {
    const { id } = useParams();
    const [token,SetToken]=useState("");
    const [showProduct, setShowProduct] = useState(false);
    const [showSubForm, setShowSubForm] = useState(false);
    const [vchstatus,setVchstatus]=useState("");
    const [tableData, setTableData] = useState([
        {
            description: "",
            hsn: '',
            gst: '',
            dueOn: "",
            quantity: "",
            rate: "",
            uom: "",
            discount: "",
            amount: "",
            companyname:"",
            allocation: [
                {
                    dueOn: "",
                    location: "♦ Any",
                    batchNo: "♦ Any",
                    quantity: "",
                    rate: "",
                    uom: "",
                    discount: "",
                    amount: "",
                },
            ],
        },
    ]);
    const tableRefs = useRef([]);
    const inputRefs = useRef([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [headerData, setHeaderData] = useState({
        customerName: '',
        voucherNo: '',
        voucherDate: '',
        voucherType: '',
        orderNo: '',
        companyname:''
    });
    const [narration, setNarration] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [focusedRow, setFocusedRow] = useState(null)
    const setInputRef = useCallback(
        (index) => (el) => {
            inputRefs.current[index] = el;
        }, []
    );
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                SetToken(localStorage.getItem('token'));
             
                const response = await axios.get(`${API_URL}/api/v1/purchase-orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = response.data;
                 // map api
                setHeaderData({
                    customerName: data.partyLedgerName,
                    voucherNo: data.voucherNumber,
                    voucherDate: data.voucherDate,
                    voucherType: data.voucherType,
                    orderNo: data.orderNo,
                    companyname:data.companyName
                });
                // map inventoryentries to your tabledata state
                if (data.inventoryEntries && data.inventoryEntries.length > 0) {
                    const mapperTableData = data.inventoryEntries.map(entry => ({
                        description: entry.itemName,
                        hsn: entry.hsnCode,
                        gst: entry.gstPercentage ?? '',
                        dueOn: formatDate(data.voucherDate),
                        quantity: entry.billedQty.toFixed(2),
                        rate: entry.itemRate,
                        uom: entry.itemUom,
                        discount: "",
                        amount: Math.abs(entry.itemAmount).toFixed(2),
                        companyname:entry.companyName,
                        allocation: [
                            {
                                dueOn: formatDate(data.voucherDate),
                                location: "♦ Any",
                                batchNo: "♦ Any",
                                quantity: entry.billedQty.toFixed(2),
                                rate: entry.itemRate,
                                uom: entry.itemUom,
                                discount: "",
                                amount: Math.abs(entry.itemAmount).toFixed(2),
                            }
                        ]
                    }));
                    setTableData(mapperTableData);
                    setNarration(data.narration);
                    setCreatedBy(data.createdBy);
                    setApprovedBy(
                        data.approvedBy=="Approved By Tally" ? "Approved":''
                    );
                    setVchstatus(data.approvedBy);
                 }
            } catch (error) {
                console.error('Failed to fetch order:', error);
                alert("Error fetching order details")
            }
        };

        if (id) {
            fetchOrderData();
        }
    }, [id]);

    const handleKeyDown = (e, rowIndex, colIndex) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            e.preventDefault();

            const nextCell = rowIndex * 2 + colIndex + 1;

            if (nextCell < tableRefs.current.length && tableRefs.current[nextCell]) {
                tableRefs.current[nextCell]?.focus();
                tableRefs.current[nextCell].setSelectionRange(0, 0)
            } else {
                if (rowIndex === tableData.length - 1) {
                    if (inputRefs.current[3]) {
                        inputRefs.current[3].focus();
                    }
                } else {
                    tableRefs.current[(rowIndex + 1) * 2]?.focus();
                    tableRefs.current[(rowIndex + 1) * 2].setSelectionRange(0, 0)
                }
            }
        } else if (e.key === "Backspace") {
            const prevCell = rowIndex * 2 + colIndex - 1;
            if (prevCell >= 0 && prevCell < tableRefs.current.length) {
                e.preventDefault();
                tableRefs.current[prevCell]?.focus();
                tableRefs.current[prevCell].setSelectionRange(0, 0);
            }
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (showSubForm) {
                    setShowSubForm(false)
                } else {
                    navigate(-1);
                }
            }
        }
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [navigate, showSubForm, showProduct]);

    // const handleFormSubmit = async () => {
    //     const customerName = headerData.customerName;
    //     const voucherNo = headerData.voucherNo;
    //     const voucherDate = headerData.voucherDate;
    //     const voucherType = headerData.voucherType;
    //     const orderNo = headerData.orderNo;
    //     const orderItem = tableData.map((item) => ({
    //         description: item.description,
    //         dueDate: item.dueOn,
    //         quantity: item.quantity,
    //         rate: item.rate,
    //         uom: item.uom,
    //         discount: item.discount,
    //         amount: item.amount,
    //         batchWiseItem: item.allocation.map((batch) => ({
    //             dueDate: batch.dueOn,
    //             location: batch.location,
    //             batchNo: batch.batchNo,
    //             quantity: batch.quantity,
    //             rate: batch.rate,
    //             uom: batch.uom,
    //             discount: batch.discount,
    //             amount: batch.amount,
    //         })),
    //     }));
    //     const data = {
    //         customerName,
    //         voucherNo,
    //         voucherDate,
    //         voucherType,
    //         orderNo,
    //         orderItem,
    //         narration,
    //         createdBy,
    //         approvedBy
    //     };
    //     await axios.post('/transact/save', data);
    // };


    const afterAllocation = (row) => {
        setTimeout(() => {
            tableRefs.current[row * 2 + 1]?.focus();
        }, 0)
    }

    useEffect(() => {
        tableRefs.current = tableRefs.current.filter(ref => ref !== null);

    }, [tableData])

    const totalQuantity = useMemo(() => {
        const qty = tableData.reduce((sum, alloc) => {
            const num =
                typeof alloc.quantity === 'number'
                    ? alloc.quantity
                    : parseFloat(alloc.quantity?.toString().replace(/,/g, '')) || 0;
            return sum + num;
        }, 0);

        return qty.toFixed(2);
    }, [tableData]);

    const totalAmount = useMemo(() => {
        const amt = tableData.reduce(
            (sum, alloc) => sum + (parseFloat(alloc.amount) || 0),
            0
        );

        return amt.toFixed(2);
    }, [tableData]);

 

    return (
        <>
            <div className="w-full h-145">
                <Title title="Order Voucher Creation" customerName={headerData.customerName} orderData={{
                    voucherNo: headerData.voucherNo,
                    voucherDate: headerData.voucherDate,
                    orderNo: headerData.orderNo,
                    items: tableData,
                    totalAmount: totalAmount,
                    narration: narration
                }} />
                
                <form
                    action=""
                    className="relative"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Header
                        title="Purchase Order"
                        inputRefs={inputRefs}
                        setInputRef={setInputRef}
                        data={headerData}
                        tableRefs={tableRefs}
                    />
                    <div className="h-[calc(100vh-125px)] overflow-auto">
                        <table className="w-full">
                            <thead className=" bg-[#F9F3CC] text-[12px] border border-slate-300 font-semibold sticky top-0">
                                <tr className="h-4.25 leading-4 border border-slate-300">
                                    <th className="w-11.25 text-center border border-slate-300">
                                        S.No
                                    </th>
                                    <th className="w-105 text-center border border-slate-300">
                                        Product Name
                                    </th>
                                    <th className="w-17.5 text-center border border-slate-300">
                                        HSN
                                    </th>
                                    <th className="w-17.5 text-center border border-slate-300">
                                        GST %
                                    </th>
                                    <th className="w-15 text-center border border-slate-300">
                                        Due on
                                    </th>
                                    <th className="w-17.5 text-center border border-slate-300">
                                        Quantity
                                    </th>
                                    <th className="w-12.5 text-center border border-slate-300">
                                        UOM
                                    </th>
                                    <th className="w-22.5 text-right border border-slate-300">
                                        Rate
                                    </th>
                                    <th className="w-9.5 text-center border border-slate-300">
                                        Disc %
                                    </th>
                                    {/* <th className="w-17.5 text-center border border-slate-300">
                                        Tax %
                                    </th> */}
                                    <th className="w-25.75 text-right border border-slate-300 pr-1">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, rowIndex) => (
                                    <tr
                                        className=" text-[13px] h-4.25 leading-4 font-semibold"
                                        key={rowIndex}
                                    >
                                        <td className="text-center border border-slate-300 bg-white">
                                            {rowIndex + 1}
                                        </td>
                                        <td className="border border-slate-300 bg-white">
                                            <input
                                                type="text"
                                                ref={(input) => (tableRefs.current[rowIndex * 2 + 0] = input)}
                                                className="w-full outline-0 focus:bg-amber-300 pl-1 capitalize"
                                                name="description"
                                                defaultValue={item.description}
                                                //value={item.description}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        setSelectedItem( item.description);
                                                        setShowSubForm(true)
                                                    }
                                                }}
                                                onFocus={() => {
                                                    setShowProduct(true);
                                                    setFocusedRow(rowIndex);
                                                }}
                                                readOnly={vchstatus === 'Approved'}
                                                autoComplete="off"
                                                // onBlur={() => setShowProduct(false)}
                                            />
                                        </td>
                                        <td className="pl-1 border border-slate-300 bg-white">
                                            {item.hsn || ''}
                                            {/* {""} */}
                                        </td>
                                        <td className="text-center border border-slate-300 bg-white">
                                            {item.gst ? item.gst + ' %' : ''}
                                            {/* {"Null"} */}
                                        </td>
                                        <td className="text-center border border-slate-300 bg-white">
                                            {item.dueOn}
                                        </td>
                                        <td className="border border-slate-300 bg-white text-right pr-1">
                                              <input
                                                className="w-full outline-0 text-right focus:bg-amber-300 pr-1"
                                                type="text"
                                                name="Quantity"
                                                defaultValue={item.quantity}
                                             />
                                        </td>
                                        <td className="text-center border border-slate-300 bg-white">
                                            {item.uom}
                                        </td>
                                        <td className="text-right border border-slate-300 bg-white pr-1">
                                            {formatINR(item.rate)}
                                        </td>
                                        <td className="text-center border border-slate-300 bg-white">
                                            {/* {item.discount ? item.discount + ' %' : ''} */}
                                            {""}
                                        </td>
                                        <td className="border border-slate-300 bg-white cursor-default">
                                            <input
                                                className="w-full outline-0 text-right focus:bg-amber-300 pr-1"
                                                type="text"
                                                name="amount"
                                                value={formatINR(item.amount)}
                                                ref={(input) =>
                                                    (tableRefs.current[rowIndex * 2 + 1] = input)
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                            {showSubForm && (
                                    <VoucherSub
                                        isClose={setShowSubForm}
                                        selectionItem={selectedItem}
                                        orderData={tableData}
                                        setOrderData={setTableData}
                                        allocation={tableData[focusedRow].allocation}
                                        row={focusedRow}
                                        afterAllocation={afterAllocation}
                                        approve={vchstatus}
                                    />
                            )}
                    </div>
                    <div className="w-full flex mb-0.5">
                        <div className="border-y border-slate-400 h-5.5 w-117.5 flex items-center justify-between ml-222.5">
                            <span className="w-20 text-right text-[14px] font-semibold">
                                {totalQuantity !== '0.00' ? totalQuantity : ''}
                            </span>
                            <span className="w-24 text-right text-[14px] font-semibold">
                                {totalAmount !== '0.00' ? formatINR(totalAmount) : ''}
                            </span>
                        </div>
                    </div>

                    {/* Footer Component */}
                                    <Footer
                        narration={narration}
                        setNarration={setNarration}
                        inputRefs={inputRefs}
                        setInputRef={setInputRef}
                        createdBy={createdBy}
                        setCreatedBy={setCreatedBy}
                        approvedBy={approvedBy}
                        setApprovedBy={setApprovedBy}
                        navigate={navigate}
                        id={id}
                        token={token}
                        tableData={tableData}
                        headerData={headerData}
                        totalAmount={totalAmount}
                        approve={vchstatus}
                     />
                </form>
            </div>
        </>
    );
};

export default PurchaseOrder;
