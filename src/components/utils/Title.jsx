import { useState } from "react";
import { HiXMark, HiOutlinePrinter, HiOutlineShare } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Title = ({ title, customerName, orderData }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

 const handlePdfAction = async (actionType) => {
    try {
        setIsProcessing(true);

        const formattedItems = orderData?.items?.map(item => ({
            name: item.description,
            gst: item.gst,
            qty: parseFloat(item.quantity),
            rate: parseFloat(item.rate),
            amount: item.amount,
            hsn: item.hsn,
            uom: item.uom
        })) || [];

        const res = await fetch("http://localhost:8080/api/invoice/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                invoiceNo: orderData?.voucherNo || "POM-001",
                date: orderData?.voucherDate || new Date().toLocaleDateString('en-GB'),
                customerName: customerName,
                orderNo: orderData?.orderNo,
                address: "Chennai",
                items: formattedItems,
            })
        });

        if (!res.ok) throw new Error("Failed to generate PDF");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        // 🔥 DIFFERENT BEHAVIOR BASED ON ACTION
        if (actionType === "print") {
            const printWindow = window.open(url);

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            // ✅ DOWNLOAD FILE
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice-${orderData?.voucherNo || "file"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // cleanup
        setTimeout(() => window.URL.revokeObjectURL(url), 2000);

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Error processing PDF request.");
    } finally {
        setIsProcessing(false);
    }
};

    return (
        <div className="bg-[#88bee6] w-full h-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <h1 className="text-[11px] pl-2 font-bold uppercase tracking-wider text-slate-800">
                {title}
            </h1>

            <div className="flex items-center h-full">
                <div className="flex gap-4 mr-4 text-[10px] font-bold uppercase">
                    {/* EXPORT BUTTON */}
                    <button 
                        type="button"
                        disabled={isProcessing}
                        className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                        onClick={() => handlePdfAction("download")}
                    >
                        <HiOutlineShare className="text-[12px]" />
                        {isProcessing ? "..." : "Export"}
                    </button>

                    {/* PRINT BUTTON - Now uses the PDF logic */}
                    <button 
                        type="button"
                        disabled={isProcessing}
                        className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                        onClick={() => handlePdfAction("print")}
                    >
                        <HiOutlinePrinter className="text-[12px]" />
                        Print
                    </button>
                </div>

                <div 
                    className="h-full px-3 flex items-center bg-red-400 hover:bg-red-500 transition-colors cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <HiXMark className="text-white font-bold text-[14px]" />
                </div>
            </div>
        </div>
    );
};

export default Title;