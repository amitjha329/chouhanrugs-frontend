type ExchangeRateReply = {
    success: boolean
    query: Query
    info: Info
    date: string
    result: number
}

type Query = {
    from: string
    to: string
    amount: number
}

type Info = {
    timestamp: number
    rate: number
}

export default ExchangeRateReply