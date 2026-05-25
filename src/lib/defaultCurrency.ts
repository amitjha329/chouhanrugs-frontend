import type Currency from "@/types/Currency"

export const DEFAULT_USD_CURRENCY: Currency = {
    _id: "default-usd",
    country: "United States",
    ISO: "US",
    currency: "USD",
    currencySymbol: "$",
    exchangeRates: 1,
    active: true,
    default: true,
}
