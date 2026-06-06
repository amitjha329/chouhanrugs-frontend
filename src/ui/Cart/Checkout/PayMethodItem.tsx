// @ts-nocheck
'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { FaPaypal, FaStripe } from 'react-icons/fa'
import { MdPayment } from 'react-icons/md'
import { SiRazorpay } from 'react-icons/si'
import { HiCheck, HiLockClosed } from 'react-icons/hi2'
import { Dispatch, SetStateAction, useEffect } from 'react'
import Currency from '@/types/Currency'
import PaymentGatewayDataModel from '@/types/PaymentGatewayDataModel'

const paymentMeta = {
    RZP: { label: 'Razorpay', Icon: SiRazorpay, caption: 'UPI, cards and net banking' },
    STRIPE: { label: 'Stripe', Icon: FaStripe, caption: 'International cards' },
    PAYPAL: { label: 'PayPal', Icon: FaPaypal, caption: 'PayPal wallet and cards' },
    PAYONEER: { label: 'Payoneer', Icon: MdPayment, caption: 'Global payment network' },
}

const PayMethodItem = ({ pgList, selected, setSelected, currency }: {
    pgList: PaymentGatewayDataModel[],
    selected: PaymentGatewayDataModel | null | undefined,
    setSelected: Dispatch<SetStateAction<PaymentGatewayDataModel | null | undefined>>
    currency: Currency
}) => {
    const availableMethods = pgList.filter((method) => currency?.currency === 'INR' ? method.partner === 'RZP' : method.partner !== 'RZP')

    useEffect(() => {
        if (availableMethods.length === 0 || selected) return
        if (currency?.currency === 'INR') {
            setSelected(availableMethods.find(item => item.partner === 'RZP') ?? availableMethods[0])
            return
        }
        setSelected(availableMethods.find(item => item.partner === 'PAYPAL') ?? availableMethods[0])
    }, [availableMethods, currency?.currency, selected, setSelected])

    return (
        <RadioGroup value={selected} onChange={setSelected} className="grid gap-2 sm:grid-cols-2">
            {availableMethods.map((method) => {
                const meta = paymentMeta[method.partner as keyof typeof paymentMeta] ?? paymentMeta.PAYONEER
                const Icon = meta.Icon

                return (
                    <Radio
                        key={method._id}
                        value={method}
                        className={({ checked, focus }) => [
                            'group relative cursor-pointer rounded-lg border bg-base-100 p-4 transition focus:outline-none',
                            checked ? 'border-primary bg-primary/5 shadow-sm' : 'border-primary/10 hover:border-primary/35',
                            focus ? 'ring-2 ring-primary/20' : '',
                        ].join(' ')}
                    >
                        {({ checked }) => (
                            <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-base-content">{meta.label}</p>
                                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${checked ? 'border-primary bg-primary text-primary-content' : 'border-base-300'}`}>
                                            {checked && <HiCheck className="h-3.5 w-3.5" />}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-base-content/55">{meta.caption}</p>
                                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-base-content/45">
                                        <HiLockClosed className="h-3 w-3" />
                                        Secure payment
                                    </p>
                                </div>
                            </div>
                        )}
                    </Radio>
                )
            })}
        </RadioGroup>
    )
}

export default PayMethodItem
