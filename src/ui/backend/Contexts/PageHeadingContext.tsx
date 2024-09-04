'use client'

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from "react"

const PageHeadingContext = createContext<{ pageHeading: string, setPageHeading: Dispatch<SetStateAction<string>> }>({ pageHeading: "", setPageHeading: () => { } })

export default function PageHeadingContextProvider({ children }: { children: React.ReactNode }) {
    const [pageHeading, setPageHeading] = useState("")
    const value = useMemo(() => ({
        pageHeading, setPageHeading
    }), [pageHeading])
    return <PageHeadingContext.Provider value={value}>{children}</PageHeadingContext.Provider>
}

export const usePageHeading = () => {
    return useContext(PageHeadingContext)
}