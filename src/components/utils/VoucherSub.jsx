import React, { useEffect, useRef, useState } from "react";
import ModalTitle from "./ModalTitle.jsx";
import { formatINR } from "./utils.js";
const VoucherSub = ({
	isClose,
	selectionItem,
	orderData,
	setOrderData,
	allocation,
	row,
	afterAllocation,
	approve
}) => {
	const inputRefs = useRef([]);

	const [location] = useState([
		{ label: "♦ Any" },
		{ label: "Main Location" },
		{ label: "Sub Location" },
		{ label: "East Location" },
		{ label: "West Location" },
	]);
	const [filteredLocation] = useState(location);
	const [selectedLocation, setSelectedLocation] = useState(0);
 	const updateClose = () => {
		isClose(false);
	};
	const totalQuantity = new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(
		allocation.reduce((sum, alloc) => {
			const num = typeof alloc.quantity === 'number'
				? alloc.quantity
				: parseFloat(alloc.quantity?.replace(/,/g, '')) || 0;
			return sum + num;
		}, 0)
	);

	const totalAmount = new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(
		allocation.reduce((sum, alloc) => {
			const num = typeof alloc.amount === 'number'
				? alloc.amount
				: parseFloat(alloc.amount?.replace(/,/g, '')) || 0;
			return sum + num;
		}, 0)
	);

	// DueDate days adding prefix
	const addDueDay = (e, item, index) => {
		if (e.key === 'Enter') {
			const regex = /^\d+$/;

			if (regex.test(item)) {
				const updated = [...orderData];

				updated[row].allocation = updated[row].allocation.map((alloc, i) =>
					i === index
						? { ...alloc, dueOn: item + " Days" }
						: alloc
				);

				setOrderData(updated);

				inputRefs.current[index * 8 + 1]?.focus();
			}

			if (item.trim() === "" && allocation.length - 1 > 0) {
				const updated = [...orderData];

				updated[row].allocation = allocation.filter(
					(item) => item.dueOn !== ""
				);

				setOrderData(updated);
				updateAllocation();
			} else if (item.trim() !== "") {
				inputRefs.current[index * 8 + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (e, rowIndex, fieldIndex) => {
		const key = e.key;

		// only for not first row
		if (rowIndex > 0 && key === "Enter") {
			if (fieldIndex === 3) {
				e.preventDefault();
				inputRefs.current[rowIndex * 8 + 7]?.focus()
			} else {
				const nextField = rowIndex * 8 + fieldIndex + 1;
				if (
					nextField < inputRefs.current.length &&
					inputRefs.current[nextField]
				) {
					inputRefs.current[nextField]?.focus();
				} else {
					if (rowIndex === allocation.length - 1) {
						addAllocationRow()
					} else {
						inputRefs.current[(rowIndex + 1) * 8]?.focus();
					}
				}
			}
		} else {
			// this is for First row only
			if (key === "Enter" && allocation[0].dueOn.trim() !== "") {
				e.preventDefault();
				const nextField = rowIndex * 8 + fieldIndex + 1;
				if (
					nextField < inputRefs.current.length &&
					inputRefs.current[nextField]
				) {
					inputRefs.current[nextField]?.focus();
				} else {
					if (rowIndex === allocation.length - 1) {
						addAllocationRow()
					} else {
						inputRefs.current[(rowIndex + 1) * 8]?.focus();
					}
				}
			} else if (key === 'Backspace') {
				const previousIndex = rowIndex * 8 + fieldIndex - 1;
				if (e.target.value !== "") {
					return;
				} else {
					if (previousIndex >= 0 && previousIndex < inputRefs.current.length) {
						e.preventDefault();
						inputRefs.current[previousIndex].focus();
						inputRefs.current[previousIndex].setSelectionRange(0, 0);
					}
				}
			}
		}
	};
	const addAllocationRow = () => {
		const newAllocation = [...orderData];
		const alloctions = allocation;
		alloctions.push({
			dueOn: "",
			location: "",
			batchNo: "",
			quantity: "",
			rate: '',
			uom: '',
			discount: '',
			amount: "",
		});
		setOrderData(newAllocation);
		setTimeout(() => {
			const nextRowFirstField = allocation.length;
			inputRefs.current[nextRowFirstField * 8]?.focus();
		}, 0);
	};

	const updateAllocation = React.useCallback(() => {
		const newRow = [...orderData];

		newRow[row].dueOn = newRow[row].allocation[0].dueOn;

		newRow[row].quantity = parseFloat(
			newRow[row].allocation.reduce(
				(sum, alloc) => sum + parseFloat(alloc.quantity),
				0
			)
		).toFixed(2);

		newRow[row].rate = parseFloat(newRow[row].allocation[0].rate || 0).toFixed(2);
		newRow[row].uom = newRow[row].allocation[0].uom;
		newRow[row].discount = newRow[row].allocation[0].discount;

		newRow[row].amount = parseFloat(
			newRow[row].allocation.reduce((sum, alloc) => sum + alloc.amount, 0)
		).toFixed(2);

		setOrderData(newRow);
		afterAllocation(row);

		isClose(false);
	}, [orderData, row, afterAllocation, isClose, setOrderData]);

	useEffect(() => {
		const handleKeys = (e) => {
			if (e.ctrlKey && e.key === "a") {
				e.preventDefault();
				updateAllocation();
			} else if (e.key === "Escape") {
				isClose(false);
			}
		};
		window.addEventListener("keydown", handleKeys);
		return () => {
			window.removeEventListener("keydown", handleKeys);
		};
	}, [isClose, updateAllocation]);

	const handleLocation = (item, index) => {
		const updated = [...orderData];

		updated[row].allocation = updated[row].allocation.map((alloc, i) =>
			i === index
				? { ...alloc, location: item }
				: alloc
		);

		setOrderData(updated);

		inputRefs.current[index * 8 + 2]?.focus();
	};

	const handleLocationSelect = (e, rowIndex) => {
		const key = e.key;
		if (key === "ArrowUp" && selectedLocation > 0) {
			setSelectedLocation((prev) => prev - 1);
		} else if (key === "ArrowDown" && selectedLocation < location.length - 1) {
			setSelectedLocation((prev) => prev + 1);
		} else if (key === "Enter") {
			handleLocation(filteredLocation[selectedLocation].label, rowIndex);
			setSelectedLocation(0);
		}
	}
	const handleQuantityChange = (allocateIndex, value) => {
    const qty = parseFloat(value) || 0;

    setOrderData(prev => {
        const updated = [...prev];

        const currentRow = updated[row];

        const updatedAllocation = currentRow.allocation.map((item, index) => {
            if (index === allocateIndex) {
                const rate = parseFloat(item.rate) || 0;
                return {
                    ...item,
                    quantity: value,
                    amount: (qty * rate).toFixed(2)
                };
            }
            return item;
        });

        updated[row] = {
            ...currentRow,
            allocation: updatedAllocation
        };
        return updated;

    });
	
};

	return (
		<>
			<div className="w-full fixed inset-0 bg-slate-400 bg-opacity-85 z-1 flex flex-col items-center">
				<div className="flex items-center justify-between w-full ">
					<ModalTitle title={"Stock Item Allocations"} onHandle={updateClose} />
				</div>
				<div className=" min-w-116.25 flex justify-center items-center h-full ">
					<div className="min-h-120 bg-white border border-slate-500 ">
						<h1 className="text-[14px] text-center py-1">
							Item Allocations for : <strong>{selectionItem}</strong>
						</h1>
						<div className="h-112.5 overflow-auto">
							<table>
								<thead className="">
									<tr className="border-y border-slate-400 text-[14px] leading-5 ">
										<th className="border border-slate-400 text-center w-20 font-semibold ">
											Due on
										</th>
										<th className="border border-slate-400 text-center w-32 font-semibold">
											Location
										</th>
										<th className="border border-slate-400 text-center w-24 font-semibold">
											Batch/Lot No.
										</th>
										<th className="border border-slate-400 text-center w-20 font-semibold">
											Quantity
										</th>
										<th className="border border-slate-400 text-center w-10 font-semibold">
											UOM
										</th>
										<th className="border border-slate-400 text-right w-20 font-semibold pr-2">
											Rate
										</th>
										<th className="border border-slate-400 text-center w-12 italic font-semibold">
											Disc %
										</th>
										<th className="border border-slate-400 w-24 text-right font-semibold pr-0.5">
											Amount
										</th>
									</tr>
								</thead>
								<tbody>
									{allocation.map((allocate, allocateIndex) => (
										<React.Fragment key={allocateIndex}>
											<tr className="text-[13px] h-4.25 leading-4">
												<td className="border border-slate-300 text-center w-16 font-semibold">
													<input
														type="text"
														autoFocus="on"
														name="dueOn"
														value={allocate.dueOn || ""}
														className="  outline-0  text-right focus:bg-[#fee8af] pr-0.5 w-full"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8] = el)
														}
														onKeyDown={(e) =>
															addDueDay(e, e.target.value, allocateIndex)
														}
														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														name="location"
														value={allocate.location || ""}
														className="outline-0 text-center focus:bg-[#fee8af]  pr-0.5 w-full font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 1] = el)
														}

														onKeyDown={(e) =>
															handleLocationSelect(e, allocateIndex)
														}
														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														autoComplete="off"
														name="batchNo"
														value={allocate.batchNo || ""}
														className=" outline-0 focus:bg-[#fee8af]  pr-0.5 w-full font-semibold text-center"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 2] = el)
														}
														onKeyDown={(e) =>
															handleKeyDown(e, allocateIndex, 2)
														}
														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														autoComplete="off"
														  type="text"
														   name="quantity"
														   defaultValue={allocate.quantity}
															onChange={(e) =>
																handleQuantityChange(allocateIndex, e.target.value)
															}
														className="outline-0 text-right focus:bg-[#fee8af] pr-0.5 w-full appearance-none font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 3] = el)
														}
														onChange={(e)=>{
															handleQuantityChange(allocateIndex, e.target.value)
														}}
														onKeyDown={(e) => {
															if (
																e.key === 'Enter' &&
																e.target.value.trim() !== ''
															) {
																handleKeyDown(e, allocateIndex, 3);
															}
														}}
                                                		readOnly={approve === 'Approved'}
 													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														autoComplete="off"
														name="uom"
														value={allocate.uom || ""}
														className="outline-0 text-right focus:bg-[#fee8af]  pr-0.5 w-full font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 4] = el)
														}
														onKeyDown={(e) =>
															handleKeyDown(e, allocateIndex, 4)
														}

														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														autoComplete="off"
														name="rate"
														value={formatINR(allocate.rate || 0)}
														className="outline-0 text-right focus:bg-[#fee8af] pr-0.5 w-full font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 5] = el)
														}
														onKeyDown={(e) =>
															handleKeyDown(e, allocateIndex, 5)
														}

														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														autoComplete="off"
														name="discount"
														value={allocate.discount || ""}
														className="outline-0 text-right focus:bg-[#fee8af]  pr-0.5 w-full font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 6] = el)
														}

														onKeyDown={(e) =>
															handleKeyDown(e, allocateIndex, 6)
														}

														readOnly
													/>
												</td>
												<td className="border border-slate-300">
													<input
														type="text"
														autoComplete="off"
														name="amount"
														value={formatINR(allocate.amount || 0)}
														className="outline-0 text-right focus:bg-[#fee8af] pr-0.5 w-full font-semibold"
														ref={(el) =>
															(inputRefs.current[allocateIndex * 8 + 7] = el)
														}
														onKeyDown={(e) =>
															handleKeyDown(e, allocateIndex, 7)
														}
														readOnly
													/>
												</td>
											</tr>
										</React.Fragment>
									))}
								</tbody>
							</table>
						</div>
						<div className="border-t border-double border-b-4 flex justify-between mb-1">
							<h1 className="font-semibold pl-2 w1/2 text-[14px]">Total</h1>
							<div className="w-1/2 flex justify-between text-[14px]">
								<span className="font-semibold">
									{totalQuantity !== '0.00' ? totalQuantity : ""}
								</span>
								<span className="pr-2 font-semibold">
									{totalAmount !== '0.00' ? formatINR(totalAmount) : ""}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VoucherSub;