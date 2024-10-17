'use client'
import { RadioGroup } from "@headlessui/react"
import { FaPaypal, FaStripe } from "react-icons/fa"
import { MdCheckCircleOutline } from "react-icons/md"
import { SiRazorpay } from 'react-icons/si'
import { Dispatch, SetStateAction } from 'react'
import Currency from "@/types/Currency"
import PaymentGatewayDataModel from "@/types/PaymentGatewayDataModel"

const PayMethodItem = ({ pgList, selected, setSelected, currency }: {
    pgList: PaymentGatewayDataModel[],
    selected: PaymentGatewayDataModel | null,
    setSelected: Dispatch<SetStateAction<PaymentGatewayDataModel | null>>
    currency: Currency
}) => {
    return (
        <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="space-y-2">
                {pgList.map((paymentPartners) => (
                    currency?.currency === "INR" ? paymentPartners.partner === "RZP" && <RadioGroup.Option
                        key={paymentPartners._id}
                        value={paymentPartners}
                        className={({ active, checked }) =>
                            `${active
                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                : ''
                            }
                  ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                            }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                    >
                        {({ active, checked }) => <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <RadioGroup.Label
                                        as="p"
                                        className={`font-medium flex items-center  ${checked ? 'text-white' : 'text-gray-900'
                                            }`}>
                                        {
                                            paymentPartners.partner == "RZP" &&
                                            <><SiRazorpay className="h-6 w-6 mr-4" />Razorpay</>
                                        }
                                    </RadioGroup.Label>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-white">
                                    <MdCheckCircleOutline className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        }
                    </RadioGroup.Option> : paymentPartners.partner !== "RZP" && <RadioGroup.Option
                        key={paymentPartners._id}
                        value={paymentPartners}
                        className={({ active, checked }) =>
                            `${active
                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                : ''
                            }
                  ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                            }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                    >
                        {({ active, checked }) => <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <RadioGroup.Label
                                        as="p"
                                        className={`font-medium flex items-center  ${checked ? 'text-white' : 'text-gray-900'
                                            }`}>
                                        {
                                            paymentPartners.partner == "STRIPE" &&
                                            <><FaStripe className="h-6 w-6 mr-4" />Stripe</>
                                        }
                                        {
                                            paymentPartners.partner == "PAYPAL" &&
                                            <><FaPaypal className="h-6 w-6 mr-4" />PayPal</>
                                        }
                                    </RadioGroup.Label>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-white">
                                    <MdCheckCircleOutline className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        }
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    )
}

export default PayMethodItem