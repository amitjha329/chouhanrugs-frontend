'use server'

import clientPromise from "../mongodb/clientPromise"
import ExchangeRateReply from "../types/ExchangeRateReply"

export default async function getExchangeRate(currency: String): Promise<ExchangeRateReply> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collection = db.collection("currencies")
    const deafultCurrency = await collection.find({ default: true }).toArray()
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.APILAYER_KEY ?? "");
    const requestOptions = {
        method: 'GET',
        redirect: 'follow' as RequestRedirect,
        headers: myHeaders
    };
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currency}&from=${deafultCurrency.length > 0 ? deafultCurrency[0].currency : "INR"}&amount=1`, requestOptions)
    return response.json()
}