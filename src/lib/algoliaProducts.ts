import "server-only";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
    buildProductAlgoliaParams,
    PRODUCT_SEARCH_ATTRIBUTES,
    type ProductAlgoliaSearchOptions,
} from "@/lib/algoliaProductFilters";
import type { ProductDataModelWithColorMap } from "@/types/ProductDataModel";
import { getPublicAlgoliaConfig } from "@/lib/algoliaConfig";

export async function getInitialAlgoliaProducts(
    options: ProductAlgoliaSearchOptions,
    hitsPerPage = 16,
): Promise<ProductDataModelWithColorMap[]> {
    try {
        const algolia = await getPublicAlgoliaConfig();

        if (!algolia.ALGOLIA_APPID || !algolia.ALGOLIA_KEY_CLIENT || !algolia.ALGOLIA_INDEX) {
            return [];
        }

        const searchClient = algoliasearch(algolia.ALGOLIA_APPID, algolia.ALGOLIA_KEY_CLIENT);
        const algoliaParams = buildProductAlgoliaParams(options);

        const response = await searchClient.search({
            requests: [{
                indexName: algolia.ALGOLIA_INDEX,
                query: algoliaParams.query,
                filters: algoliaParams.filters,
                facetFilters: algoliaParams.facetFilters,
                hitsPerPage,
                attributesToRetrieve: PRODUCT_SEARCH_ATTRIBUTES,
            }],
        });

        const firstResult = response.results[0];
        if (!("hits" in firstResult)) return [];

        return firstResult.hits.map((hit) => hit as unknown as ProductDataModelWithColorMap);
    } catch (error) {
        console.error("Initial Algolia product fetch failed:", error);
        return [];
    }
}
