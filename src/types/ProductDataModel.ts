import { ObjectId } from "mongodb";
import ColorDataModel from "./ColorDataModel";
import { LocalizedField } from "@/lib/resolveLocalized";

export interface ProductDataModel {
    _id?: string | ObjectId;
    objectID:string;
    variations: Variation[];
    highlights: LocalizedField<string[]>;
    careInstructions: LocalizedField<string[]>;
    productName: LocalizedField<string>;
    productTitle?: LocalizedField<string>;
    productURL: LocalizedField<string>;
    productBrand: string;
    productBaseColor: string;
    productCategory: string;
    productStockQuantity: number;
    tags: string[];
    productMSRP: number;
    productDiscountPercentage: string;
    productSellingPrice: number;
    productPriceSqFt: number;
    productDescriptionShort: LocalizedField<string>;
    productDescriptionLong: LocalizedField<string>;
    productShippingInfo: LocalizedField<string>;
    productPrimaryImageIndex: number;
    productFeaturedImage?: string;
    productCustomizable: boolean;
    productReturns: boolean;
    productFreeDel: boolean;
    productHandCrafted: boolean;
    productShape?: object
    productPattern?: object
    images: string[];
    productReviews: ProductReviews;
    productActive: boolean;
    addedOn: number;
    updatedOn: number;

    // Enhanced Fields
    metaTitle?: LocalizedField<string>;
    metaDescription?: LocalizedField<string>;
    metaKeywords?: LocalizedField<string>;
    sku?: string;
    gtin?: string;
    lowStockThreshold?: number;
    weight?: number;
    weightUnit?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    productStatus?: 'Draft' | 'Published' | 'Archived';
    visibility?: 'Catalog' | 'Search' | 'Hidden' | 'Both';
    isFeatured?: boolean;
    material?: LocalizedField<string>;
    countryOfOrigin?: string;

    // Rug Specific / Competitor Analysis Fields
    pileThickness?: string;
    texture?: LocalizedField<string>;
    warranty?: string;
    variationWarning?: LocalizedField<string>;
    itemCode?: string;
    certifications?: string[];

    // Merchant Center overrides
    merchantGoogleProductCategory?: string;
    merchantMaterial?: string;
    merchantColor?: string;
    merchantSize?: string;
    merchantGtin?: string;
    merchantMpn?: string;
    merchantExcluded?: boolean;
}

export interface ProductDataModelWithColorMap extends ProductDataModel {
    colorMap?: ColorDataModel[]
    priceRange?: {
        min: number
        max: number
    }
    msrpRange?: {
        min: number
        max: number
    }
}

export type ProductReviews = {
    average: number;
    totalReviews: number;
    reviews: any[];
}

export type Variation = {
    variationCode: string;
    variationStock: string;
    variationPrice: string;
    variationDiscount: string;
    variationColor: string | null;
    variationSize: string | null;
    variationImages: string[];
}
