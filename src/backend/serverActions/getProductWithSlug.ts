import clientPromise from "@/lib/clientPromise";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { extractColorsAndSizes } from "./extractColorsSizesFromVariation";
import ColorDataModel from "@/types/ColorDataModel";
import SizeDataModel from "@/types/SizeDataModel";
import { cacheLife, cacheTag } from "next/cache";
import { locales } from '@/i18n/routing';

interface ProductWithSizeandColorData extends ProductDataModel{
    colorData:ColorDataModel[],
    sizeData:SizeDataModel[]
}

async function getProductWithSlugInternal(slug: string): Promise< ProductWithSizeandColorData| undefined> {
    "use cache";

    cacheLife("seconds");
    cacheTag("products");

    try {
        const client = await clientPromise;
        const db = client.db();
        const product = await db.collection("products").findOne({
            $or: [
                { productURL: slug },
                ...locales.map(loc => ({ [`productURL.${loc}`]: slug }))
            ]
        });
        if (product === null) {
            throw new Error("Product not found");
        }
        const products = converter.fromWithNoFieldChange<ProductDataModel>(product);
        const { colors, sizes } = extractColorsAndSizes(products)
        const colrSizePromise = [
            db.collection("colors").find({
                name: {
                    $in: colors
                }
            }).toArray(),
            db.collection("sizes").find({
                sizeCode: {
                    $in: sizes
                }
            }).toArray()
        ]
        const [colorData, sizeData] = await Promise.all(colrSizePromise)
        return {...products, colorData:colorData.map(item=>converter.fromWithNoFieldChange<ColorDataModel>(item)) , sizeData:sizeData.map(item=>converter.fromWithNoFieldChange<SizeDataModel>(item))}
    } catch (error) {
        return undefined;
    }
}

export const getProductWithSlug = getProductWithSlugInternal;
