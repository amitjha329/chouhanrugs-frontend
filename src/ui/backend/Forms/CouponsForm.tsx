'use client'
import saveCouponForm from "@/lib/actions/saveCouponForm";
import CouponDataModel from "@/lib/types/CouponDataModel";
import onPageNotifications from "@/ui/common/onPageNotifications";
import { format, getUnixTime } from "date-fns";
import { FormEventHandler, MouseEventHandler, Ref, forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const CouponForm = () => {
    const [isListLoading, setIsListLoading] = useState(false)
    const [couponName, setCouponName] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [couponType, setCouponType] = useState(0)
    const [couponValue, setCouponvalue] = useState("")
    const [couponDescription, setCouponDescription] = useState("")
    const [couponMinOrderValue, setCouponMinOrderValue] = useState("")
    const [couponMaxValue, setCouponMaxValue] = useState("")
    const generateCode = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
        for (let i = 0; i < 8; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text
    }
    const [couponValidity, setCouponValidity] = useState(new Date())
    const ButtonReference = ({ value, onClick }: { value?: any, onClick?: MouseEventHandler<HTMLButtonElement> }, ref: Ref<HTMLButtonElement>) => (
        <button
            onClick={onClick}
            ref={ref}
            type="button"
            className='inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500'
        >
            {format(new Date(value), 'dd MMMM yyyy')}
        </button>
    )
    const ButtonInput = forwardRef(ButtonReference)

    const createNewCoupon: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const data: CouponDataModel = {
            name: couponName,
            code: couponCode,
            value: parseInt(couponValue),
            description: couponDescription,
            type: couponType,
            expiration: getUnixTime((new Date(couponValidity))),
            minOrder: parseInt(couponMinOrderValue),
            maxValue: parseInt(couponMaxValue),
        }
        console.log(data)
        saveCouponForm(data).then((res) => {
            onPageNotifications("success", "Coupon Created, Refreshing Page")
            window.location.reload()
        }).catch((err) => {
            onPageNotifications("error", "Failed To Create Coupon")
        })
    }
    return (
        <div className="card shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mb-8">
            <form id="coupon-form" onSubmit={createNewCoupon}>
                <div className="card-body">
                    <div className="card-title mb-5">Add New Coupon</div>
                    <div className="text-red-600 text-lg font-semibold">Note: Please keep in ming that all prices entered below are in USD</div>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Coupon Name</span>
                        <input type="text" className='input input-bordered w-full' name="coupon_name" placeholder='Coupon Name' required onChange={e => setCouponName(e.currentTarget.value)} />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical relative'>
                        <span>Coupon Code</span>
                        <input type="text" className='input input-bordered w-full !rounded-b-lg' name="coupon_code" placeholder='Coupon Code' required onChange={e => setCouponCode(e.currentTarget.value)} value={couponCode} />
                        <button className="btn absolute right-0 bottom-0 !rounded-bl-none" type="button" onClick={e => { setCouponCode(generateCode()) }}>Generate</button>
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Coupon Type</span>
                        <select className='select select-bordered w-full' name="coupon_type" defaultValue={0} required onChange={e => setCouponType(Number(e.currentTarget.value))}>
                            <option value={0} disabled>Select Coupon Type</option>
                            <option value={1}>Percentage (%)</option>
                            <option value={2}>Price</option>
                        </select>
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Coupon Value</span>
                        <input type="number" min={0} className='input input-bordered w-full' name="coupon_value" placeholder='Coupon Value' required onChange={e => setCouponvalue(e.currentTarget.value)} />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Coupon Validity</span>
                        <DatePicker
                            selected={couponValidity}
                            onChange={(date) => date && setCouponValidity(date)}
                            selectsStart
                            startDate={couponValidity}
                            popperClassName="react-datepicker-left"
                            customInput={<ButtonInput />}
                            renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                            }) => (
                                <div className="flex items-center justify-between px-2 py-2">
                                    <span className="text-lg text-gray-700">
                                        {format(date, 'MMMM yyyy')}
                                    </span>

                                    <div className="space-x-2">
                                        <button
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                            type="button"
                                            className={`
                                            ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                        >
                                            <MdChevronLeft className="w-5 h-5 text-gray-600" />
                                        </button>

                                        <button
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                            type="button"
                                            className={`
                                            ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                        >
                                            <MdChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Minimum Order Value</span>
                        <input type="number" min={0} className='input input-bordered w-full' name="product_name" placeholder='Minimum Order Value' required onChange={e => setCouponMinOrderValue(e.currentTarget.value)} />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Maximum Value</span>
                        <input type="number" min={0} className='input input-bordered w-full' name="product_name" placeholder='Minimum Order Value' required onChange={e => setCouponMaxValue(e.currentTarget.value)} />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Coupon Description</span>
                        <input type="text" className='input input-bordered w-full' name="product_name" placeholder='Coupon Description' required onChange={e => setCouponDescription(e.currentTarget.value)} />
                    </label>
                    <div className="card-actions justify-end">
                        <button className="btn" type="submit">Create Coupon</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CouponForm;