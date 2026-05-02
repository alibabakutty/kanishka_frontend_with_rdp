import { useEffect } from 'react';

const Header = ({ title, inputRefs, setInputRef, data, tableRefs, isForex }) => {

	const getFormattedDate = () => {
		if (!data.voucherDate) return { startDate: '', day: '' };

		const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		const currentDate = new Date(data.voucherDate);

		const d = currentDate.getDate();
		const m = monthsShort[currentDate.getMonth()];
		const y = String(currentDate.getFullYear()).slice(2);

		return {
			startDate: `${d}-${m}-${y}`,
			day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDate.getDay()]
		};
	};

	const date = getFormattedDate();

	useEffect(() => {
		inputRefs.current[0]?.focus();
		inputRefs.current[0]?.setSelectionRange(0, 0);
	}, [inputRefs]);

	return (
		<div className="flex justify-between border-b border-slate-300">
			<div className="">
				<div className="pt-1.5 flex leading-4">
					<label className="bg-[#2a67b1] pl-1 text-[13px] text-white font-semibold  min-w-32 px-5">
						{title || ""}
					</label>
					<span className="text-[14px] font-semibold ml-1">
						:
					</span>
					<input type="text" name='voucherNo' value={data.voucherNo} className='w-32 text-[13px] outline-0 border border-transparent focus:border focus:border-blue-400 focus:bg-amber-200 bg-transparent ml-1 font-semibold ' readOnly />
				</div>

				<div className="flex leading-4 px-1 pt-1.5">
					<label htmlFor="custNo" className="w-32 text-[14px] font-semibold">
						Party A/c Name
					</label>
					<div className="mr-0.5">:</div>
					<input
						ref={setInputRef(isForex ? 3 : 1)}
						name="customerName"
						autoComplete="off"
						value={data.customerName || ""}
						type="text"
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								tableRefs.current[0]?.focus()
							}
						}}
						className="w-90 border border-transparent focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
						readOnly
					/>
				</div>
			</div>
			{isForex && (
				<div className="pt-1.5 flex justify-center items-center">
					<div className="text-[13px] flex gap-10 leading-4">
						<div className="flex leading-4">
							<label htmlFor="" className='font-semibold'>Currency Type</label>
							<span className="mx-1">:</span>
							<input
								name='currencyType'
								type="text"
								className="w-24 border border-transparent focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
								ref={setInputRef(0)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.target.value !== '') {
										inputRefs.current[1]?.focus();
									}
								}}
								value={data.currencyType || ""}
							/>
						</div>
						<div className="flex leading-4">
							<label htmlFor="" className='font-semibold'>Exchange Rate</label>
							<span className="mx-1">:</span>
							<input
								name='exchangeRate'
								type="text"
								className="w-12 border border-transparent focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold text-red-700 text-right pr-0.5"
								ref={setInputRef(1)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.target.value !== '') {
										inputRefs.current[2]?.focus();
									}
								}}
								value={data.exchangeRate || ""}

							/>
						</div>
					</div>
				</div>
			)}
			<div className="pt-1 flex flex-col px-1 leading-4">
				<label htmlFor="" className="text-[13px] text-right font-semibold">
					<input
						type="text"
						className="w-20 text-[14px] outline-0 border border-transparent focus:border focus:border-blue-400 focus:bg-amber-200 bg-transparent text-center"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && e.target.value !== '') {
								if (isForex) {
									inputRefs.current[3]?.focus();
								} else {
									inputRefs.current[1]?.focus();
								}
							}
						}}
						ref={setInputRef(isForex ? 2 : 0)}
						value={date.startDate}
						readOnly
					/>
				</label>
				<label className="text-[14px] text-right mr-3 font-semibold">{date.day}</label>

				<div className="flex leading-4">
					<label className="text-[13px] w-20 font-semibold">Order No</label>
					<div className="mx-0.5">:</div>
					<input
						type="text"
						id="orderNo"
						value={data.orderNo || ""}
						name="orderNo"
						ref={setInputRef(isForex ? 4 : 2)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								tableRefs.current[0]?.focus();
							} else if (e.key === 'Backspace') {
								if (e.target.value !== '') {
									return;
								} else {
									e.preventDefault();
									inputRefs.current[1]?.focus();
									inputRefs.current[1].setSelectionRange(0, 0);
								}
							}
						}}
						className="outline-0 border border-transparent font-semibold pl-1 h-4.5 focus:bg-[#fee8af] focus:border focus:border-blue-500 text-[13px] bg-transparent w-32"
						readOnly
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
