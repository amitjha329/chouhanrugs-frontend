type PaymentGatewayDataModel = {
    _id: string,
    partner: "RZP" | "STRIPE" | "PAYTM" | "PAYPAL",
    key_id: string,
    key_secret?: string,
    updatedOn: number,
    activation: boolean,
    webhook_secret?: string
}

export default PaymentGatewayDataModel