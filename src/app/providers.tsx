'use client'

import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import ProductContext from "@/utils/Contexts/ProductContext"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

export function ProductDataContextProvider({ product, children }: Readonly<{ children: React.ReactNode, product: ProductDataModelWithColorMap }>) {
    return <ProductContext product={product}>{children}</ProductContext>
}

export function PaypalContextProvider({ children, key_id, client_token }: Readonly<{ children: React.ReactNode, key_id: string, client_token: string }>) {
    return <PayPalScriptProvider options={{
        clientId: key_id,
        dataClientToken: client_token,
        components: ['buttons', 'hosted-fields'],
        intent: "capture"
    }}>
        {children}
    </PayPalScriptProvider>
}