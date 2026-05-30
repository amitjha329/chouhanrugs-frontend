'use server'
import { connection } from 'next/server'
import clientPromise from '@/lib/clientPromise';
import PayPalAccessToken from '@/types/PayPalAccessToken';
import { PayPalOrder } from '@/types/PayPalOrder';
import { PayPalOrderCapture } from '@/types/PayPalOrderCapture';
import fetch, { Response } from 'node-fetch';
import { getConfigBulk } from '@/lib/services/ConfigService';

const DEFAULT_PAYPAL_API_BASE = 'https://api-m.paypal.com'
const PAYPAL_API_CONFIG_KEYS = ['PayPal_API', 'PAYPAL_API', 'PAYPAL_API_BASE']

async function getPayPalApiBase(): Promise<string> {
    const config = await getConfigBulk(PAYPAL_API_CONFIG_KEYS)
    const base = config.PayPal_API
        || config.PAYPAL_API
        || config.PAYPAL_API_BASE
        || process.env.PayPal_API
        || process.env.PAYPAL_API
        || process.env.PAYPAL_API_BASE
        || DEFAULT_PAYPAL_API_BASE

    if (!base) {
        throw new Error('PayPal API base URL is not configured')
    }
    return base.trim().replace(/\/+$/, '')
}

// call the create order method
export async function createOrder(value: string, currency_code: string) {
    await connection()
    const base = await getPayPalApiBase()
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code,
                        value,
                    },
                },
            ],
        }),
    })
    const responseParsed = await handleResponse<PayPalOrder>(response)
    return responseParsed.id;
}

// capture payment for an order
export async function capturePayment(orderId: string) {
    await connection()
    const base = await getPayPalApiBase()
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return await handleResponse<PayPalOrderCapture>(response);
}

// generate access token
export async function generateAccessToken(): Promise<string> {
    await connection()
    const base = await getPayPalApiBase()
    const db = await clientPromise
    const collection = db.db(process.env.MONGODB_DB).collection("paymentGateway")
    const paypalData = await collection.findOne({ partner: "PAYPAL" })
    if (!paypalData?.key_id || !paypalData?.key_secret) {
        throw new Error('PayPal credentials are not configured')
    }
    const auth = Buffer.from(paypalData?.key_id + ':' + paypalData?.key_secret).toString('base64');
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'post',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
    const jsonData = await handleResponse<PayPalAccessToken>(response);
    return jsonData.access_token;
}

// generate client token
export async function generateClientToken(): Promise<string> {
    await connection()
    const base = await getPayPalApiBase()
    const accessToken = await generateAccessToken();
    const response = await fetch(`${base}/v1/identity/generate-token`, {
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
        },
    })
    console.log('response', response.status);
    const jsonData = await handleResponse<any>(response);
    return jsonData.client_token;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 200 || response.status === 201) {
        return response.json() as T;
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}
