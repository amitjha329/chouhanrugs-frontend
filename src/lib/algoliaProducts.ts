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

export interface AlgoliaServerSideSearchResponse {
    hits: ProductDataModelWithColorMap[];
    nbHits: number;
    nbPages: number;
    page: number;
    hitsPerPage: number;
    facets: Record<string, Record<string, number>>;
    facets_stats: Record<string, { min: number; max: number }>;
}

export async function searchAlgoliaProductsServerSide(
    options: ProductAlgoliaSearchOptions,
    hitsPerPage = 16,
): Promise<AlgoliaServerSideSearchResponse> {
    const defaultResponse: AlgoliaServerSideSearchResponse = {
        hits: [],
        nbHits: 0,
        nbPages: 0,
        page: 0,
        hitsPerPage,
        facets: {},
        facets_stats: {},
    };

    try {
        const algolia = await getPublicAlgoliaConfig();

        if (!algolia.ALGOLIA_APPID || !algolia.ALGOLIA_KEY_CLIENT || !algolia.ALGOLIA_INDEX) {
            return defaultResponse;
        }

        const searchClient = algoliasearch(algolia.ALGOLIA_APPID, algolia.ALGOLIA_KEY_CLIENT);
        const algoliaParams = buildProductAlgoliaParams(options);
        
        // Algolia pages are 0-indexed. UI pages are typically 1-indexed.
        const page = Math.max(0, Number(options.searchParams?.page || 1) - 1);

        const response = await searchClient.search({
            requests: [{
                indexName: algolia.ALGOLIA_INDEX,
                query: algoliaParams.query,
                filters: algoliaParams.filters,
                facetFilters: algoliaParams.facetFilters,
                hitsPerPage,
                page,
                facets: ["*"],
                attributesToRetrieve: PRODUCT_SEARCH_ATTRIBUTES,
            }],
        });

        const firstResult = response.results[0];
        if (!firstResult || !("hits" in firstResult)) {
            return defaultResponse;
        }

        return {
            hits: firstResult.hits.map((hit) => hit as unknown as ProductDataModelWithColorMap),
            nbHits: firstResult.nbHits ?? 0,
            nbPages: firstResult.nbPages ?? 0,
            page: firstResult.page ?? 0,
            hitsPerPage: firstResult.hitsPerPage ?? hitsPerPage,
            facets: (firstResult.facets as Record<string, Record<string, number>>) ?? {},
            facets_stats: (firstResult.facets_stats as Record<string, { min: number; max: number }>) ?? {},
        };
    } catch (error) {
        console.error("Server-side Algolia search failed:", error);
        return defaultResponse;
    }
}
