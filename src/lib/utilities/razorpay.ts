import Razorpay from 'razorpay'
import { Orders } from 'razorpay/dist/types/orders'

export default class RZP {
    instance: Razorpay | undefined
    id: string
    secret: string
    constructor(id: string, secret: string) {
        this.id = id
        this.secret = secret
        this.instance = undefined
    }

    createInstance() {
        this.instance = new Razorpay({
            key_id: this.id,
            key_secret: this.secret,
        })
    }

    getInstance() {
        return this.instance
    }

    createOrder = async (amount: number, currency: string): Promise<Orders.RazorpayOrder | undefined> => {
        return this.instance?.orders.create({
            amount,
            currency,
        })
    }
}