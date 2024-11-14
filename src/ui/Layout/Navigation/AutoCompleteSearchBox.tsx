'use client'
import React, { useMemo } from "react";
import {
    createElement,
    Fragment,
    useEffect,
    useRef,
    useState
} from "react";
import { createRoot, Root } from "react-dom/client";


import { usePagination, useSearchBox } from "react-instantsearch";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { BaseItem } from "@algolia/autocomplete-core";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";

import "@algolia/autocomplete-theme-classic";
import { SearchClient } from "algoliasearch";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
    searchClient: SearchClient
    indexName: string
    className?: string;
};

type SetInstantSearchUiStateOptions = {
    query: string;
};

export function Autocomplete({
    searchClient,
    className,
    indexName,
    ...autocompleteProps
}: AutocompleteProps) {
    const autocompleteContainer = useRef<HTMLDivElement>(null);
    const panelRootRef = useRef<Root | null>(null);
    const rootRef = useRef<HTMLElement | null>(null);

    const { query, refine: setQuery } = useSearchBox();
    const { refine: setPage } = usePagination();

    const [instantSearchUiState, setInstantSearchUiState] = useState<
        SetInstantSearchUiStateOptions
    >({ query });

    const plugins = useMemo(() => {
        const recentSearches = createLocalStorageRecentSearchesPlugin({
            key: "instantsearch",
            limit: 3,
            transformSource({ source }) {
                return {
                    ...source,
                    onSelect({ item }) {
                        setInstantSearchUiState({ query: item.label });
                    }
                };
            }
        });
        const querySuggestions = createQuerySuggestionsPlugin({
            searchClient,
            indexName,
            getSearchParams() {
                return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 6
                });
            },
            transformSource({ source }) {
                return {
                    ...source,
                    sourceId: "querySuggestionsPlugin",
                    onSelect({ item }) {
                        setInstantSearchUiState({ query: item.query });
                    },
                    getItems(params) {
                        if (!params.state.query) {
                            return [];
                        }

                        return source.getItems(params);
                    },
                    templates: {
                        item({ item }) {
                            return item.productName as unknown as string
                        },
                    }
                };
            }
        });

        return [recentSearches, querySuggestions];
    }, []);

    useEffect(() => {
        setQuery(instantSearchUiState.query);
        setPage(0);
    }, [instantSearchUiState]);

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
                setInstantSearchUiState({ query: "" });
            },
            onSubmit({ state }) {
                setInstantSearchUiState({ query: state.query });
            },
            onStateChange({ prevState, state }) {
                if (prevState.query !== state.query) {
                    setInstantSearchUiState({
                        query: state.query
                    });
                }
            },
            renderer: { createElement, Fragment, render: () => { } },
            render({ children }, root) {
                if (!panelRootRef.current || rootRef.current !== root) {
                    rootRef.current = root;

                    panelRootRef.current?.unmount();
                    panelRootRef.current = createRoot(root);
                }

                panelRootRef.current.render(children);
            }
        });

        return () => autocompleteInstance.destroy();
    }, []);

    return <div className={className} ref={autocompleteContainer} />;
}
