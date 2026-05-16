type SiteDataModel = {
    _id: string;
    title: string;
    logoSrc: string;
    description: string;
    tag_line: string;
    url:string;
    isTitle: boolean;
    profiles:string[]
    marketplaceLinks?: MarketplaceLink[];
    productCraftSection?: ProductCraftSection;
    contact_details: ContactDetails;
}

export type ProductCraftSection = {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    image?: string;
    imageAlt?: string;
    stats?: ProductCraftStat[];
    steps?: ProductCraftStep[];
    highlights?: string[];
}

export type ProductCraftStat = {
    value: string;
    label: string;
}

export type ProductCraftStep = {
    title: string;
    description: string;
}

export type MarketplaceLink = {
    platform: "etsy" | "amazon" | "faire" | "custom";
    label: string;
    url: string;
    enabled: boolean;
}

export type ContactDetails = {
    flat_house: string;
    address1: string;
    address2: string;
    state: string;
    country: string;
    PIN: string;
    email: string;
    phone: string;
    whatsapp: string;
}

export default SiteDataModel
