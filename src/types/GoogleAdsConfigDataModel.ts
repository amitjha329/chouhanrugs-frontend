type GoogleAdsConfigDataModel = {
    _id: string
    type: "GOOGLE_ADS"
    code: string       // Conversion ID e.g. "AW-16522702647"
    gtagId: string     // GA4 Measurement ID e.g. "G-TN2CJF5YB6"
    conversionLabels: {
        signup: string
        addToCart: string
        emailLead: string
        purchase: string
        whatsappLead: string
    }
}

export default GoogleAdsConfigDataModel
