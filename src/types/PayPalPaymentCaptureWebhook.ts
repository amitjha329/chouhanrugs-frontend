export type PaypalPaymentCapture = {
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
    payee:                     Payee;
    amount:                    Amount;
    sellerProtection:          SellerProtection;
    supplementaryData:         SupplementaryData;
    updateTime:                Date;
    createTime:                Date;
    finalCapture:              boolean;
    sellerReceivableBreakdown: SellerReceivableBreakdown;
    links:                     Link[];
    id:                        string;
    status:                    string;
}

export type Amount = {
    currencyCode: string;
    value:        string;
}

export type Payee = {
    emailAddress: string;
    merchantID:   string;
}

export type SellerProtection = {
    status:            string;
    disputeCategories: string[];
}

export type SellerReceivableBreakdown = {
    grossAmount: Amount;
    paypalFee:   Amount;
    netAmount:   Amount;
}

export type SupplementaryData = {
    relatedIDS: RelatedIDS;
}

export type RelatedIDS = {
    orderID: string;
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
