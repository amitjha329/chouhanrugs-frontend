type StripeWebhookResponse = {
    id: string
    object: string
    amount: number
    amount_captured: number
    amount_refunded: number
    application: any
    application_fee: any
    application_fee_amount: any
    balance_transaction: string
    billing_details: BillingDetails
    calculated_statement_descriptor: string
    captured: boolean
    created: number
    currency: string
    customer: any
    description: any
    destination: any
    dispute: any
    disputed: boolean
    failure_balance_transaction: any
    failure_code: any
    failure_message: any
    fraud_details: FraudDetails
    invoice: any
    livemode: boolean
    metadata: Metadata
    on_behalf_of: any
    order: any
    outcome: Outcome
    paid: boolean
    payment_intent: string
    payment_method: string
    payment_method_details: PaymentMethodDetails
    receipt_email: any
    receipt_number: any
    receipt_url: string
    refunded: boolean
    review: any
    shipping: any
    source: any
    source_transfer: any
    statement_descriptor: any
    statement_descriptor_suffix: any
    status: string
    transfer_data: any
    transfer_group: any
}

type BillingDetails = {
    address: Address
    email: any
    name: any
    phone: any
}

type Address = {
    city: any
    country: string
    line1: any
    line2: any
    postal_code: any
    state: any
}

type FraudDetails = {}

type Metadata = {}

type Outcome = {
    network_status: string
    reason: any
    risk_level: string
    risk_score: number
    seller_message: string
    type: string
}

type PaymentMethodDetails = {
    card: Card
    type: string
}

type Card = {
    brand: string
    checks: Checks
    country: string
    exp_month: number
    exp_year: number
    fingerprint: string
    funding: string
    installments: any
    last4: string
    mandate: any
    network: string
    network_token: any
    three_d_secure: ThreeDSecure
    wallet: any
}

type Checks = {
    address_line1_check: any
    address_postal_code_check: any
    cvc_check: string
}

type ThreeDSecure = {
    authentication_flow: any
    result: string
    result_reason: any
    version: string
}
export default StripeWebhookResponse