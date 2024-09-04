export interface PayPalOrder {
    id: string
    intent: string
    status: string
    purchase_units: PurchaseUnit[]
    create_time: string
    links: Link[]
  }
  
  export interface PurchaseUnit {
    reference_id: string
    amount: Amount
    payee: Payee
  }
  
  export interface Amount {
    currency_code: string
    value: string
  }
  
  export interface Payee {
    email_address: string
    merchant_id: string
  }
  
  export interface Link {
    href: string
    rel: string
    method: string
  }