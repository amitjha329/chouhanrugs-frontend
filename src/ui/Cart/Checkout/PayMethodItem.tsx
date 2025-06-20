// @ts-nocheck
'use client'
import { RadioGroup, Radio, Label } from "@headlessui/react"
import { FaPaypal, FaStripe } from "react-icons/fa"
import { MdCheckCircleOutline } from "react-icons/md"
import { SiRazorpay } from 'react-icons/si'
import { Dispatch, SetStateAction, useEffect } from 'react'
import Currency from "@/types/Currency"
import PaymentGatewayDataModel from "@/types/PaymentGatewayDataModel"

const PayMethodItem = ({ pgList, selected, setSelected, currency }: {
    pgList: PaymentGatewayDataModel[],
    selected: PaymentGatewayDataModel | null | undefined,
    setSelected: Dispatch<SetStateAction<PaymentGatewayDataModel | null | undefined>>
    currency: Currency
}) => {
    useEffect(() => {
        if (pgList.length > 0 && !selected) {
            if (currency?.currency === "INR") {
                setSelected(pgList.find(item => item.partner === "RZP"))
            } else {
                setSelected(pgList.find(item => item.partner === "PAYPAL"))
            }
        }
    }, [pgList])
    
    return (
        <RadioGroup value={selected} onChange={setSelected}>
            <div className="space-y-3">
                {pgList.map((paymentPartners) => (
                    currency?.currency === "INR" ? paymentPartners.partner === "RZP" && <Radio
                        key={paymentPartners._id}
                        value={paymentPartners}
                        className={({ checked, focus: active }) =>
                            `${active ? 'ring-2 ring-primary ring-opacity-60 ring-offset-2' : ''}
                            ${checked ? 'bg-primary text-primary-content border-primary shadow-lg' : 'bg-base-100 border-base-300 hover:border-primary/50 hover:shadow-md'} 
                            relative flex cursor-pointer rounded-xl border-2 px-6 py-5 shadow-sm transition-all duration-200 ease-in-out focus:outline-none`
                        }
                    >
                        {({ checked }) => <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <Label
                                        as="p"
                                        className={`font-semibold text-lg flex items-center ${checked ? 'text-primary-content' : 'text-base-content'}`}>
                                        {
                                            paymentPartners.partner == "RZP" &&
                                            <><SiRazorpay className="h-6 w-6 mr-4" />Razorpay</>
                                        }
                                    </Label>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-primary-content">
                                    <MdCheckCircleOutline className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        }
                    </Radio> : paymentPartners.partner !== "RZP" && <Radio
                        key={paymentPartners._id}
                        value={paymentPartners}
                        className={({ checked, focus: active }) =>
                            `${active ? 'ring-2 ring-primary ring-opacity-60 ring-offset-2' : ''}
                            ${checked ? 'bg-primary text-primary-content border-primary shadow-lg' : 'bg-base-100 border-base-300 hover:border-primary/50 hover:shadow-md'} 
                            relative flex cursor-pointer rounded-xl border-2 px-6 py-5 shadow-sm transition-all duration-200 ease-in-out focus:outline-none`
                        }
                    >
                        {({ checked }) => <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <Label
                                        as="p"
                                        className={`font-semibold text-lg flex items-center ${checked ? 'text-primary-content' : 'text-base-content'}`}>
                                        {
                                            paymentPartners.partner == "STRIPE" &&
                                            <><FaStripe className="h-6 w-6 mr-4" />Stripe</>
                                        }
                                        {
                                            paymentPartners.partner == "PAYPAL" &&
                                            <><FaPaypal className="h-6 w-6 mr-4" />PayPal</>
                                        }
                                    </Label>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-primary-content">
                                    <MdCheckCircleOutline className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        }
                    </Radio>
                ))}
            </div>
        </RadioGroup>
    )
}

export default PayMethodItem