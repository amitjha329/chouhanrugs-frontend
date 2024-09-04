'use client'

import { createOrder } from "@/lib/utilities/paypal";
import { useCurrencyContext } from "@/ui/frontend/Contexts/CurrencyContext";
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, } from "@paypal/react-paypal-js";

const CardForm = ({ amount, onApprove }: { amount: string, onApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void> }) => {
    const { userCurrency } = useCurrencyContext()
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