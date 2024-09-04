/* eslint-disable react-hooks/exhaustive-deps */
import type { SearchClient } from 'algoliasearch/lite';
import type { BaseItem } from '@algolia/autocomplete-core';
import type { AutocompleteOptions, Render } from '@algolia/autocomplete-js';

import {
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    createElement
} from 'react';

import {
    useInstantSearchContext,
    usePagination,
    useSearchBox,
} from 'react-instantsearch-core';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { debounce } from '@algolia/autocomplete-shared';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import '@algolia/autocomplete-theme-classic'

const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES = ["productCategory"]
const INSTANT_SEARCH_QUERY_SUGGESTIONS = "chouhanrugs_query_suggestions"

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
    className?: string;
    indexName: string;
    queryIndexName:string
};

type SetInstantSearchUiStateOptions = {
    query: string;
    category?: string;
};

export function Autocomplete({
    className,
    indexName,
    ...autocompleteProps
}: AutocompleteProps) {
    const autocompleteContainer = useRef<HTMLDivElement>(null);
    const { client: searchClient } = useInstantSearchContext()
    const { query, refine: setQuery } = useSearchBox();
    // const { items: categories, refine: setCategory } = useHierarchicalMenu({
    //     attributes: INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
    // });
    const { refine: setPage } = usePagination();

    const [
        instantSearchUiState,
        setInstantSearchUiState,
    ] = useState<SetInstantSearchUiStateOptions>({ query });
    const debouncedSetInstantSearchUiState = debounce(
        setInstantSearchUiState,
        500
    );

    useEffect(() => {
        setQuery(instantSearchUiState.query);
        // instantSearchUiState.category && setCategory(instantSearchUiState.category);
        setPage(0);
    }, [instantSearchUiState]);

    // const currentCategory = useMemo(
    //     () => categories.find(({ isRefined }) => isRefined)?.value,
    //     [categories]
    // );

    const plugins = useMemo(() => {
        const recentSearches = createLocalStorageRecentSearchesPlugin({
            key: 'instantsearch',
            limit: 3,
            transformSource({ source }) {
                return {
                    ...source,
                    onSelect({ item }) {
                        setInstantSearchUiState({
                            query: item.label,
                            category: item.category,
                        });
                    },
                };
            },
        });

        const querySuggestionsInCategory = createQuerySuggestionsPlugin({
            searchClient: searchClient as SearchClient,
            indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
            getSearchParams() {
                return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 3,
                    // facetFilters: [
                    //     `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:${currentCategory}`,
                    // ],
                });
            },
            transformSource({ source }) {
                return {
                    ...source,
                    sourceId: 'querySuggestionsInCategoryPlugin',
                    onSelect({ item }) {
                        setInstantSearchUiState({
                            query: item.query,
                            category: item.__autocomplete_qsCategory,
                        });
                    },
                    getItems(params: any) {
                        // if (!currentCategory) {
                        //     return [];
                        // }

                        return source.getItems(params);
                    },
                    templates: {
                        ...source.templates,
                        header({ items }) {
                            if (items.length === 0) {
                                return <Fragment />;
                            }

                            return (
                                <Fragment>
                                    <span className="aa-SourceHeaderTitle" />
                                    {/* In {currentCategory}
                                    </span> */}
                                    <span className="aa-SourceHeaderLine" />
                                </Fragment>
                            );
                        },
                    },
                };
            },
        });

        const querySuggestions = createQuerySuggestionsPlugin({
            searchClient: searchClient as SearchClient,
            indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
            getSearchParams() {
                // if (!currentCategory) {
                return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 6,
                });
                // }

                return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 3,
                    // facetFilters: [
                    //     `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:-${currentCategory}`,
                    // ],
                });
            },
            categoryAttribute: [
                indexName,
                'facets',
                'exact_matches',
                INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0],
            ],
            transformSource({ source }) {
                return {
                    ...source,
                    sourceId: 'querySuggestionsPlugin',
                    onSelect({ item }) {
                        setInstantSearchUiState({
                            query: item.query,
                            category: item.__autocomplete_qsCategory || '',
                        });
                    },
                    getItems(params) {
                        if (!params.state.query) {
                            return [];
                        }

                        return source.getItems(params);
                    },
                    templates: {
                        ...source.templates,
                        header({ items }) {
                            // if (!currentCategory || items.length === 0) {
                            //     return <></>;
                            // }
                            if (items.length === 0) {
                                return <></>;
                            }
                            return (
                                <Fragment>
                                    <span className="aa-SourceHeaderTitle">
                                        In other categories
                                    </span>
                                    <span className="aa-SourceHeaderLine" />
                                </Fragment>
                            );
                        },
                    },
                };
            },
        });

        return [recentSearches, querySuggestionsInCategory, querySuggestions];
        // }, [currentCategory]);
    }, []);

    useEffect(() => {
        if (!autocompleteContainer.current) {
            return;
        }

        const autocompleteInstance = autocomplete({
            ...autocompleteProps,
            container: autocompleteContainer.current,
            initialState: { query },
            plugins,
            onReset() {
                // setInstantSearchUiState({ query: '', category: currentCategory });
                setInstantSearchUiState({ query: '' });
            },
            onSubmit({ state }) {
                // setInstantSearchUiState({ query: state.query });
                window.location.replace(`/products?search=${state.query}`)
            },
            onStateChange({ prevState, state }) {
                if (prevState.query !== state.query) {
                    debouncedSetInstantSearchUiState({
                        query: state.query,
                    });
                }
            },
            renderer: { createElement, Fragment, render: render as Render },

        });

        return () => autocompleteInstance.destroy();
    }, [plugins]);

    return <div className={className} ref={autocompleteContainer} />;
}
