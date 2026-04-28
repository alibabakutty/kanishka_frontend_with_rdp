import { useState } from "react";

const Footer = ({
    narration,
    setNarration,
    inputRefs,
    setInputRef,
    createdBy = '',
    setCreatedBy,
    approvedBy = '',
    setApprovedBy,
    navigate,
    id,
    token,
    tableData,
    headerData,
    totalAmount,
    approve
}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [showConfirm, setShowConfirm] = useState(false);
    const updateColl = async () => {

        // Inventory mapping sriram
        const formattedTableData = tableData.map(row => ({
            itemName: row.description,
            hsnCode: row.hsn,
            gstPercentage: row.gst,
            itemUom: row.uom,
            billedQty: row.quantity,
            itemRate: row.rate,
            itemAmount: row.amount,
            companyName: row.companyname
        }));

        // Voucher Mapping
        const newtabledata = {
            voucherType: headerData.voucherType,
            voucherDate: headerData.voucherDate,
            voucherNumber: headerData.voucherNo,
            partyLedgerName: headerData.customerName,
            totalAmount: totalAmount,
            orderNo: headerData.voucherNo,
            createdBy,
            approvedBy,
            narration,
            companyName: headerData.companyname,
            inventoryEntries: formattedTableData
        }


        try {
            console.log(`${API_URL}/api/v1/purchase-orders/${id}`);
            const response = await fetch(`${API_URL}/api/v1/purchase-orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newtabledata)
            });

            const data = await response.json();
            console.log("Updated successfully:", data);

        } catch (error) {
            console.error("Error updating allocation:", error);
        }
    };

    return (
        <div className="flex justify-between border border-slate-400">
            <div className="">
                <label htmlFor="narration" className="text-[14px] pl-1 mr-0.5 font-semibold">
                    Narration
                </label>
                <span className="mr-2">:</span>
                <input type="text"
                    ref={setInputRef(3)}
                    name="narration"
                    value={narration || ""}
                    onChange={(e) => setNarration(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (inputRefs.current[4]) {
                                inputRefs.current[4].focus();
                            }
                        } else if (e.key === 'Backspace') {
                            if (inputRefs.current[2]?.value === '') {
                                console.log();
                            }
                        }
                    }}
                    className="h-5 text-[13px] focus:bg-[#fee8af] overflow-hidden outline-0 focus:border focus:border-blue-400 w-120 border border-transparent capitalize pl-1"
                    readOnly={approve == 'Approved'}
                />
            </div>
            <div className="flex">
                <div>
                    <label className="text-[14px] font-semibold" htmlFor="createdBy">
                        Created By
                    </label>
                    <span className="mr-1">:</span>
                    <input
                        type="text"
                        id="createdBy"
                        value={createdBy || ""}
                        ref={setInputRef(4)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (inputRefs.current[5]) {
                                    inputRefs.current[5].focus();
                                }
                            } else if (e.key === 'Backspace') {
                                if (inputRefs.current[3]?.value === '') {
                                    console.log();
                                }
                            }
                        }}
                        className="w-37.5 h-5 resize-none focus:bg-[#fee8af] overflow-hidden outline-0 focus:border focus:border-blue-400 border border-transparent text-[13px] capitalize font-semibold pl-1"
                        readOnly
                    />
                </div>
                <div>
                    <label className="text-[14px] ml-1 font-semibold" htmlFor="approvedBy">
                        Approved By
                    </label>
                    <span className="mr-1">:</span>


                    <input
                        type="text"
                        list="approveList"
                        ref={setInputRef(5)}
                        defaultValue={approvedBy}
                        onChange={(e) => setApprovedBy(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (approve !== "Approved") {
                                    setShowConfirm(true); // open modal instead of window.confirm
                                } else {
                                    navigate(-1);
                                }

                            }
                        }}
                        className="w-32 h-5 px-2 rounded-md focus:bg-[#fee8af] outline-none border border-gray-300 focus:border-blue-400 font-semibold text-[13px]"
                        readOnly={approve == 'Approved'}
                    />
                    {/* 🔥 Confirm Modal */}
                    {showConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                            <div className="bg-white p-5 rounded-xl shadow-lg w-80">

                                <h2 className="text-md font-semibold mb-3">
                                    Confirm Update
                                </h2>

                                <p className="text-sm mb-5">
                                    Do you want to Amendment ?
                                </p>

                                <div className="flex justify-end gap-3">

                                    <button
                                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        onClick={() => {
                                            updateColl();
                                            setShowConfirm(false);
                                            navigate(-1);
                                        }}
                                    >
                                        Yes
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                    <datalist id="approveList">
                        <option value="Approved" />
                        <option value="To Be Approved" />
                    </datalist>
                </div>
            </div>
        </div>
    );
};

export default Footer;