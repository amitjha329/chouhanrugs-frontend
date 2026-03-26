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
}

export interface ProductDataModelWithColorMap extends ProductDataModel {
    colorMap?: ColorDataModel[]
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