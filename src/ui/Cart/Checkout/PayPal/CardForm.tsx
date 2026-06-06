'use client'

import { createOrder } from "@/backend/serverActions/paypal";
import Currency from "@/types/Currency";
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, } from "@paypal/react-paypal-js";

const CardForm = ({ amount, onApprove, userCurrency }: { amount: string, onApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void>, userCurrency: Currency }) => {
    return (
        <div className="rounded-lg border border-primary/10 bg-base-100 p-4">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-base-content">PayPal payment</h3>
                <p className="mt-1 text-xs text-base-content/55">Use PayPal to complete this order securely.</p>
            </div>
            <PayPalButtons
                style={{
                    color: "gold",
                    shape: "rect",
                    label: "pay"
                }}
                createOrder={() => createOrder(amount, userCurrency?.currency ?? "USD")}
                onApprove={onApprove}
            />
        </div>
    );
}

export default CardForm;
