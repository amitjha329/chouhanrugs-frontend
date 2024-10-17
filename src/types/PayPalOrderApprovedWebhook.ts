export type PaypalOrderApproved = {
    id:              string;
    createTime:      Date;
    resourceType:    string;
    eventType:       string;
    summary:         string;
    resource:        Resource;
    status:          string;
    transmissions:   Transmission[];
    links:           Link[];
    eventVersion:    string;
    resourceVersion: string;
}

export type Link = {
    href:     string;
    rel:      string;
    method:   string;
    encType?: string;
}

export type Resource = {
    createTime:    Date;
    purchaseUnits: PurchaseUnit[];
    links:         Link[];
    id:            string;
    paymentSource: PaymentSource;
    intent:        string;
    payer:         Payer;
    status:        string;
}

export type Payer = {
    name:         PayerName;
    emailAddress: string;
    payerID:      string;
    address:      PayerAddress;
}

export type PayerAddress = {
    countryCode: string;
}

export type PayerName = {
    givenName: string;
    surname:   string;
}

export type PaymentSource = {
    paypal: Paypal;
}

export type Paypal = {
    emailAddress:  string;
    accountID:     string;
    accountStatus: string;
    name:          PayerName;
    address:       PayerAddress;
}

export type PurchaseUnit = {
    referenceID: string;
    amount:      Amount;
    payee:       Payee;
    shipping:    Shipping;
}

export type Amount = {
    currencyCode: string;
    value:        string;
}

export type Payee = {
    emailAddress: string;
    merchantID:   string;
}

export type Shipping = {
    name:    ShippingName;
    address: ShippingAddress;
}

export type ShippingAddress = {
    addressLine1: string;
    adminArea2:   string;
    adminArea1:   string;
    postalCode:   string;
    countryCode:  string;
}

export type ShippingName = {
    fullName: string;
}

export type Transmission = {
    webhookURL:      string;
    httpStatus:      number;
    reasonPhrase:    string;
    responseHeaders: ResponseHeaders;
    transmissionID:  string;
    status:          string;
    timestamp:       Date;
}

export type ResponseHeaders = {
    server:                        string;
    xRequestID:                    string;
    xRuntime:                      string;
    xContentTypeOptions:           string;
    connection:                    string;
    xDownloadOptions:              string;
    xPermittedCrossDomainPolicies: string;
    date:                          string;
    xFrameOptions:                 string;
    referrerPolicy:                string;
    strictTransportSecurity:       string;
    cacheControl:                  string;
    contentLength:                 string;
    xXSSProtection:                string;
    contentType:                   string;
}
