'use server';
import algoliasearch from "algoliasearch/lite";
import { ProductDataModel } from "../types/ProductDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function productSearch(query: string, limit: number): Promise<ProductDataModel[]> {
    const algoliaCLient = algoliasearch(process.env.ALGOLIA_APPID ?? "", process.env.ALGOLIA_KEY ?? "")
    const index = algoliaCLient.initIndex(process.env.ALGOLIA_INDEX ?? "")
    const searchdata = await index.search(query, { hitsPerPage: limit })
    try {
        const parsedData: Array<ProductDataModel> = []
        searchdata.hits.forEach(item => {
            parsedData.push(converter.fromAlgoliaHitToData<ProductDataModel>(item))
        })
        console.log(parsedData)
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}