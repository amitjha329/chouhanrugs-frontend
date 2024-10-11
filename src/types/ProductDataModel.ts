import { ObjectId } from "mongodb";
import ColorDataModel from "./ColorDataModel";

export interface ProductDataModel {
    _id?: string | ObjectId;
    objectID:string;
    variations: Variation[];
    highlights: string[];
    careInstructions: string[];
    productName: string;
    productURL: string;
    productBrand: string;
    productBaseColor: string;
    productCategory: string;
    productStockQuantity: number;
    tags: string[];
    productMSRP: number;
    productDiscountPercentage: string;
    productSellingPrice: number;
    productPriceSqFt: number;
    productDescriptionShort: string;
    productDescriptionLong: string;
    productShippingInfo: string;
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