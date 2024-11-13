'use client'

import { ProductDataModelWithColorMap } from "@/types/ProductDataModel"
import DataConnectionContextProvider from "@/utils/Contexts/DataConnectionContext";
import ProductContext from "@/utils/Contexts/ProductContext"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Session } from "next-auth";
import { InstantSearch } from "react-instantsearch-core";


export function ProductDataContextProvider({ product, children }: Readonly<{ children: React.ReactNode, product: ProductDataModelWithColorMap }>) {
    return <ProductContext product={product}>{children}</ProductContext>
}

export function DataContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DataConnectionContextProvider>{children}</DataConnectionContextProvider>
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

export function AlgoliaSearchProvider({ APPID, KEY, INDEX, children }: Readonly<{ children: React.ReactNode, APPID: string, KEY: string, INDEX: string }>) {
    const searchClient = algoliasearch(APPID, KEY)
    return <InstantSearch searchClient={searchClient} indexName={INDEX} future={{ preserveSharedStateOnUnmount: true }} >{children}</InstantSearch>
}