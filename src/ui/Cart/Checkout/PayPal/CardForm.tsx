'use client'

import { createOrder } from "@/backend/serverActions/paypal";
import Currency from "@/types/Currency";
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, } from "@paypal/react-paypal-js";

const CardForm = ({ amount, onApprove, userCurrency }: { amount: string, onApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void>, userCurrency: Currency }) => {
    return (
        <PayPalButtons
            style={{
                color: "blue"
            }}
            createOrder={() => createOrder(amount, userCurrency?.currency ?? "USD")}
            onApprove={onApprove}
        />
    );
}

export default CardForm;