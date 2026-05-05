import { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { HiXMark, HiOutlinePrinter, HiOutlineShare } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";


const Title = ({ title, customerName, orderData }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

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

            const res = await fetch(`${API_URL}/api/invoice/pdf`, {
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

            // ✅ Clean file name
            const safeCustomer = (customerName || "Customer")
                .replace(/[^a-z0-9]/gi, "_")
                .toUpperCase();

            const fileName = `PO-${orderData?.voucherNo || "000"}_${safeCustomer}.pdf`;

            // ================= SHARE =================
            if (actionType === "share") {
                const file = new File([blob], fileName, { type: "application/pdf" });

                try {
                    if (navigator.share) {
                        await navigator.share({
                            files: [file],
                            title: "Purchase Order",
                            text: `PO: ${orderData?.voucherNo} | Party: ${customerName}`,
                        });
                    } else {
                        throw new Error("Share not supported");
                    }
                } catch (err) {
                    // 🔁 fallback → open PDF
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                }
            }

            // ================= PRINT =================
            else if (actionType === "print") {
                const url = window.URL.createObjectURL(blob);
                const printWindow = window.open(url);
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
                setTimeout(() => window.URL.revokeObjectURL(url), 2000);
            }

            // ================= DOWNLOAD =================
            else {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => window.URL.revokeObjectURL(url), 2000);
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("PDF Error:", error);
                alert("Error processing PDF request.");
            }
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
                    {/* DOWNLOAD BUTTON */}
                    <button
                        type="button"
                        disabled={isProcessing}
                        className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                        onClick={() => handlePdfAction("download")}
                    >
                        <HiOutlineDownload className="text-[12px]" />
                        {isProcessing ? "..." : "Download"}
                    </button>


                    {/* SHARE BUTTON */}
                    <button
                        type="button"
                        disabled={isProcessing}
                        className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                        onClick={() => handlePdfAction("share")}
                    >
                        <HiOutlineShare className="text-[12px]" />
                        {isProcessing ? "..." : "Share"}
                    </button>

                    {/* PRINT BUTTON - Now uses the PDF logic */}
                    {/* <button 
                        type="button"
                        disabled={isProcessing}
                        className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                        onClick={() => handlePdfAction("print")}
                    >
                        <HiOutlinePrinter className="text-[12px]" />
                        Print
                    </button> */}
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