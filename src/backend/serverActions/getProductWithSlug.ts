import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { extractColorsAndSizes } from "./extractColorsSizesFromVariation";
import ColorDataModel from "@/types/ColorDataModel";
import SizeDataModel from "@/types/SizeDataModel";
import { locales } from '@/i18n/routing';

interface ProductWithSizeandColorData extends ProductDataModel{
    colorData:ColorDataModel[],
    sizeData:SizeDataModel[]
}

async function getProductWithSlugInternal(slug: string): Promise< ProductWithSizeandColorData| undefined> {
    try {
        const db = await getStorefrontDb();
        const product = await db.collection("products").findOne({
            $or: [
                { productURL: slug },
                ...locales.map(loc => ({ [`productURL.${loc}`]: slug }))
            ],
            productActive: true,
            productStatus: { $nin: ["Draft", "Archived"] },
            visibility: { $ne: "Hidden" }
        });
        if (product === null) {
            return undefined;
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
        console.error(`Error fetching product with slug "${slug}":`, error);
        throw error;
    }
}

export const getProductWithSlug = getProductWithSlugInternal;
