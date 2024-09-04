"use client";
import AdminDataPointsContextProvider from "@/ui/backend/Contexts/AdminDataPointsContext";
import PageHeadingContextProvider from "@/ui/backend/Contexts/PageHeadingContext";
import CurrencyContextProvider from "@/ui/frontend/Contexts/CurrencyContext";
import DataConnectionContextProvider from "@/ui/frontend/Contexts/DataConnectionContext";
import LocationContextProvider from "@/ui/frontend/Contexts/LocationContext";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
// import { InstantSearchNext } from "react-instantsearch-nextjs";
import algoliasearch from "algoliasearch/lite";
import { ProductDataModel } from "@/lib/types/ProductDataModel";
import ProductContext from "@/ui/frontend/Contexts/ProductContext";
import { InstantSearch } from "react-instantsearch-core";


export function NextSessionProider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function CurrencyProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CurrencyContextProvider>{children}</CurrencyContextProvider>
}

export function LocationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocationContextProvider>{children}</LocationContextProvider>
}

export function AdminPageHeadingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PageHeadingContextProvider>{children}</PageHeadingContextProvider>
}

export function DataConnectionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DataConnectionContextProvider>{children}</DataConnectionContextProvider>
}

export function AdminDataPointsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminDataPointsContextProvider>{children}</AdminDataPointsContextProvider>
}
export function ProductDataContextProvider({ product, children }: Readonly<{ children: React.ReactNode, product: ProductDataModel }>) {
  return <ProductContext product={product}>{children}</ProductContext>
}

export function AlgoliaSearchProvider({ APPID, KEY, INDEX, children }: Readonly<{ children: React.ReactNode, APPID: string, KEY: string, INDEX: string }>) {
  const searchClient = algoliasearch(APPID, KEY)
  return <InstantSearch searchClient={searchClient} indexName={INDEX} future={{ preserveSharedStateOnUnmount: true }} >{children}</InstantSearch>
}

export function PaypalContextProvider({ children, key_id, client_token }: Readonly<{ children: React.ReactNode, key_id: string, client_token: string }>) {
  return <PayPalScriptProvider options={{
    "client-id": key_id,
    "data-client-token": client_token,
    components: 'buttons,hosted-fields',
    intent: "capture"
  }}>
    {children}
  </PayPalScriptProvider>
}