const currencyMap: { [key: string]: string } = {
    AD: 'EUR',
    AE: 'AED',
    AF: 'AFN',
    AG: 'XCD',
    AI: 'XCD',
    AL: 'ALL',
    AM: 'AMD',
    AO: 'AOA',
    AR: 'ARS',
    AS: 'USD',
    AT: 'EUR',
    AU: 'AUD',
    AW: 'AWG',
    AX: 'EUR',
    AZ: 'AZN',
    BA: 'BAM',
    BB: 'BBD',
    BD: 'BDT',
    BE: 'EUR',
    BF: 'XOF',
    BG: 'BGN',
    BH: 'BHD',
    BI: 'BIF',
    BJ: 'XOF',
    BL: 'EUR',
    BM: 'BMD',
    BN: 'BND',
    BO: 'BOB',
    BQ: 'USD',
    BR: 'BRL',
    BS: 'BSD',
    BT: 'BTN',
    BV: 'NOK',
    BW: 'BWP',
    BY: 'BYN',
    BZ: 'BZD',
    CA: 'CAD',
    CC: 'AUD',
    CD: 'CDF',
    CF: 'XAF',
    CG: 'XAF',
    CH: 'CHF',
    CI: 'XOF',
    CK: 'NZD',
    CL: 'CLP',
    CM: 'XAF',
    CN: 'CNY',
    CO: 'COP',
    CR: 'CRC',
    CU: 'CUP',
    CV: 'CVE',
    CW: 'ANG',
    CX: 'AUD',
    CY: 'EUR',
    CZ: 'CZK',
    DE: 'EUR',
    DJ: 'DJF',
    DK: 'DKK',
    DM: 'XCD',
    DO: 'DOP',
    DZ: 'DZD',
    EC: 'USD',
    EE: 'EUR',
    EG: 'EGP',
    EH: 'MAD',
    ER: 'ERN',
    ES: 'EUR',
    ET: 'ETB',
    FI: 'EUR',
    FJ: 'FJD',
    FK: 'FKP',
    FM: 'USD',
    FO: 'DKK',
    FR: 'EUR',
    GA: 'XAF',
    GB: 'GBP',
    GD: 'XCD',
    GE: 'GEL',
    GF: 'EUR',
    GG: 'GBP',
    GH: 'GHS',
    GI: 'GIP',
    GL: 'DKK',
    GM: 'GMD',
    GN: 'GNF',
    GP: 'EUR',
    GQ: 'XAF',
    GR: 'EUR',
    GS: 'GBP',
    GT: 'GTQ',
    GU: 'USD',
    GW: 'XOF',
    GY: 'GYD',
    HK: 'HKD',
    HM: 'AUD',
    HN: 'HNL',
    HR: 'HRK',
    HT: 'HTG',
    HU: 'HUF',
    ID: 'IDR',
    IE: 'EUR',
    IL: 'ILS',
    IM: 'GBP',
    IN: 'INR',
    IO: 'USD',
    IQ: 'IQD',
    IR: 'IRR',
    IS: 'ISK',
    IT: 'EUR',
    JE: 'GBP',
    JM: 'JMD',
    JO: 'JOD',
    JP: 'JPY',
    KE: 'KES',
    KG: 'KGS',
    KH: 'KHR',
    KI: 'AUD',
    KM: 'KMF',
    KN: 'XCD',
    KP: 'KPW',
    KR: 'KRW',
    KW: 'KWD',
    KY: 'KYD',
    KZ: 'KZT',
    LA: 'LAK',
    LB: 'LBP',
    LC: 'XCD',
    LI: 'CHF',
    LK: 'LKR',
    LR: 'LRD',
    LS: 'LSL',
    LT: 'EUR',
    LU: 'EUR',
    LV: 'EUR',
    LY: 'LYD',
    MA: 'MAD',
    MC: 'EUR',
    MD: 'MDL',
    ME: 'EUR',
    MF: 'EUR',
    MG: 'MGA',
    MH: 'USD',
    MK: 'MKD',
    ML: 'XOF',
    MM: 'MMK',
    MN: 'MNT',
    MO: 'MOP',
    MP: 'USD',
    MQ: 'EUR',
    MR: 'MRO',
    MS: 'XCD',
    MT: 'EUR',
    MU: 'MUR',
    MV: 'MVR',
    MW: 'MWK',
    MX: 'MXN',
    MY: 'MYR',
    MZ: 'MZN',
    NA: 'NAD',
    NC: 'XPF',
    NE: 'XOF',
    NF: 'AUD',
    NG: 'NGN',
    NI: 'NIO',
    NL: 'EUR',
    NO: 'NOK',
    NP: 'NPR',
    NR: 'AUD',
    NU: 'NZD',
    NZ: 'NZD',
    OM: 'OMR',
    PA: 'PAB',
    PE: 'PEN',
    PF: 'XPF',
    PG: 'PGK',
    PH: 'PHP',
    PK: 'PKR',
    PL: 'PLN',
    PM: 'EUR',
    PN: 'NZD',
    PR: 'USD',
    PS: 'ILS',
    PT: 'EUR',
    PW: 'USD',
    PY: 'PYG',
    QA: 'QAR',
    RE: 'EUR',
    RO: 'RON',
    RS: 'RSD',
    RU: 'RUB',
    RW: 'RWF',
    SA: 'SAR',
    SB: 'SBD',
    SC: 'SCR',
    SD: 'SDG',
    SE: 'SEK',
    SG: 'SGD',
    SH: 'SHP',
    SI: 'EUR',
    SJ: 'NOK',
    SK: 'EUR',
    SL: 'SLL',
    SM: 'EUR',
    SN: 'XOF',
    SO: 'SOS',
    SR: 'SRD',
    ST: 'STD',
    SV: 'SVC',
    SX: 'ANG',
    SY: 'SYP',
    SZ: 'SZL',
    TC: 'USD',
    TD: 'XAF',
    TF: 'EUR',
    TG: 'XOF',
    TH: 'THB',
    TJ: 'TJS',
    TK: 'NZD',
    TL: 'USD',
    TM: 'TMT',
    TN: 'TND',
    TO: 'TOP',
    TR: 'TRY',
    TT: 'TTD',
    TV: 'AUD',
    TW: 'TWD',
    TZ: 'TZS',
    UA: 'UAH',
    UG: 'UGX',
    UM: 'USD',
    US: 'USD',
    UY: 'UYU',
    UZ: 'UZS',
    VA: 'EUR',
    VC: 'XCD',
    VE: 'VEF',
    VG: 'USD',
    VI: 'USD',
    VN: 'VND',
    VU: 'VUV',
    WF: 'XPF',
    WS: 'WST',
    YE: 'YER',
    YT: 'EUR',
    ZA: 'ZAR',
    ZM: 'ZMW',
    ZW: 'ZWL'
}

const currencySymbol: { [key: string]: string } = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'FBu',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BOV: 'BOV',
    BRL: 'R$',
    BSD: '$',
    BTC: '₿',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BYR: 'Br',
    BZD: 'BZ$',
    CAD: '$',
    CDF: 'FC',
    CHE: 'CHE',
    CHF: 'CHF',
    CHW: 'CHW',
    CLF: 'CLF',
    CLP: '$',
    CNH: '¥',
    CNY: '¥',
    COP: '$',
    COU: 'COU',
    CRC: '₡',
    CUC: '$',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'دج',
    EEK: 'kr',
    EGP: '£',
    ERN: 'Nfk',
    ETB: 'Br',
    ETH: 'Ξ',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHC: '₵',
    GHS: 'GH₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'FG',
    GTQ: 'Q',
    GYD: '$',
    HKD: '$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'JD',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'лв',
    KHR: '៛',
    KMF: 'CF',
    KPW: '₩',
    KRW: '₩',
    KWD: 'KD',
    KYD: '$',
    KZT: '₸',
    LAK: '₭',
    LBP: '£',
    LKR: '₨',
    LRD: '$',
    LSL: 'M',
    LTC: 'Ł',
    LTL: 'Lt',
    LVL: 'Ls',
    LYD: 'LD',
    MAD: 'MAD',
    MDL: 'lei',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MRO: 'UM',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MXV: 'MXV',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: '₨',
    NZD: '$',
    OMR: '﷼',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: '₨',
    PLN: 'zł',
    PYG: 'Gs',
    QAR: '﷼',
    RMB: '￥',
    RON: 'lei',
    RSD: 'Дин.',
    RUB: '₽',
    RWF: 'R₣',
    SAR: '﷼',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: 'S$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STD: 'Db',
    STN: 'Db',
    SVC: '$',
    SYP: '£',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'T',
    TND: 'د.ت',
    TOP: 'T$',
    TRL: '₤',
    TRY: '₺',
    TTD: 'TT$',
    TVD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYI: 'UYI',
    UYU: '$U',
    UYW: 'UYW',
    UZS: 'лв',
    VEF: 'Bs',
    VES: 'Bs.S',
    VND: '₫',
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XBT: 'Ƀ',
    XCD: '$',
    XOF: 'CFA',
    XPF: '₣',
    XSU: 'Sucre',
    XUA: 'XUA',
    YER: '﷼',
    ZAR: 'R',
    ZMW: 'ZK',
    ZWD: 'Z$',
    ZWL: '$'
}

const getCurrencyString = (ISO: string): string => {
    return currencyMap[ISO]
}

const getCurrencyGlyphWithCurrencyString = (Currency: string) => {
    return currencySymbol[Currency]
}

const getCurrencyGlyphWithCountryISO = (ISO: string) => {
    return currencySymbol[currencyMap[ISO]]
}

export {
    getCurrencyString,
    getCurrencyGlyphWithCurrencyString,
    getCurrencyGlyphWithCountryISO
}