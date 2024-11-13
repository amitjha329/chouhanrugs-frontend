'use client'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
    useInstantSearchContext,
    usePagination,
    useSearchBox,
} from 'react-instantsearch-core';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { debounce } from '@algolia/autocomplete-shared';
import '@algolia/autocomplete-theme-classic';
import { SearchClient } from 'algoliasearch';

const INSTANT_SEARCH_QUERY_SUGGESTIONS = "chouhanrugs_query_suggestions";

type AutocompleteProps = {
    className?: string;
    indexName: string;
    queryIndexName: string
};

export function Autocomplete({
    className,
    indexName,
}: AutocompleteProps) {
    const autocompleteContainer = useRef<HTMLDivElement>(null);
    const { client: searchClient } = useInstantSearchContext()
    const { query, refine: setQuery } = useSearchBox();
    const { refine: setPage } = usePagination();

    const [instantSearchUiState, setInstantSearchUiState] = useState({ query });
    const debouncedSetInstantSearchUiState = debounce(
        setInstantSearchUiState,
        500
    );

    useEffect(() => {
        setQuery(instantSearchUiState.query);
        setPage(0);
    }, [instantSearchUiState, setPage, setQuery]);

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
                        });
                    },
                };
            },
        });

        const querySuggestions = createQuerySuggestionsPlugin({
            searchClient: searchClient as SearchClient,
            indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
            getSearchParams() {
                return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 6,
                });
            },
            transformSource({ source }) {
                return {
                    ...source,
                    onSelect({ item }) {
                        setInstantSearchUiState({
                            query: item.query,
                        });
                    },
                    getItems(params) {
                        if (!params.state.query) {
                            return [];
                        }

                        return source.getItems(params);
                    },
                };
            },
        });

        return [recentSearches, querySuggestions];
    }, [searchClient]);

    useEffect(() => {
        if (!autocompleteContainer.current) {
            return;
        }

        const autocompleteInstance = autocomplete({
            container: autocompleteContainer.current,
            initialState: { query },
            plugins,
            onReset() {
                setInstantSearchUiState({ query: '' });
            },
            onSubmit({ state }) {
                window.location.replace(`/products?search=${state.query}`)
            },
            onStateChange({ prevState, state }) {
                if (prevState.query !== state.query) {
                    debouncedSetInstantSearchUiState({
                        query: state.query,
                    });
                }
            },
        });

        return () => autocompleteInstance.destroy();
    }, [plugins, query]);

    return <div className={className} ref={autocompleteContainer} />;
}
