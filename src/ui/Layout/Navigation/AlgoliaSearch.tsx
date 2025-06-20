'use client'
import React, { useRef, useEffect } from 'react'
import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { algoliasearch } from 'algoliasearch'
import { useRouter } from 'next/navigation'
import '@algolia/autocomplete-theme-classic'

interface AlgoliaSearchProps {
    appId: string
    apiKey: string
    indexName: string
    querySuggestionsIndex: string
}

const AlgoliaSearch: React.FC<AlgoliaSearchProps> = ({
    appId,
    apiKey,
    indexName,
    querySuggestionsIndex
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchClient = algoliasearch(appId, apiKey)

    useEffect(() => {
        if (!containerRef.current) return

        // Recent searches plugin
        const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
            key: 'chouhanrugs-recent-searches',
            limit: 5,
            transformSource({ source }) {
                return {
                    ...source,
                    templates: {
                        ...source.templates,
                        header({ html }) {
                            return html`<div class="aa-SourceHeaderTitle">Recent Searches</div>`
                        }
                    }
                }
            }
        })

        // Query suggestions plugin  
        const querySuggestionsPlugin = createQuerySuggestionsPlugin({
            searchClient,
            indexName: querySuggestionsIndex,
            getSearchParams() {
                return {
                    hitsPerPage: 8
                }
            },
            transformSource({ source }) {
                return {
                    ...source,
                    templates: {
                        ...source.templates,
                        header({ html }) {
                            return html`<div class="aa-SourceHeaderTitle">Suggestions</div>`
                        }
                    }
                }
            }
        })

        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: 'Search for products...',
            openOnFocus: true,
            detachedMediaQuery: 'none',
            plugins: [recentSearchesPlugin, querySuggestionsPlugin],
            getSources() {
                return [
                    {
                        sourceId: 'products',
                        getItems({ query }: { query: string }) {
                            if (!query) return []

                            return searchClient.searchSingleIndex({
                                indexName,
                                searchParams: {
                                    query,
                                    hitsPerPage: 6,
                                    attributesToRetrieve: ['objectID', 'productName', 'productPrice', 'productImage', 'productSlug']
                                }
                            }).then(({ hits }) => hits)
                        },
                        templates: {
                            item({ item, html }) {
                                // if (!(item as any).productName) return ''
                                // return html``;
                                console.log(item)
                                return html`
                  <div class="aa-ItemWrapper">
                    <div class="aa-ItemContent">
                      <div class="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                      <img src="${(item as any)._highlightResult.images[0].value}" alt="${(item as any).productName}" width="40" height="40"/>
                      </div>
                      <div class="aa-ItemContentBody">
                        <div class="aa-ItemContentTitle">
                          ${(item as any).productName}
                        </div>
                        <div class="aa-ItemContentDescription">
                          $${(item as any)._highlightResult.productSellingPrice ? (item as any)._highlightResult.productSellingPrice.value : (item as any).productPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                `
                            },
                            header({ html }) {
                                return html`<div class="aa-SourceHeaderTitle">Products</div>`
                            }
                        },
                        onSelect({ item }: { item: any }) {
                            router.push(`/products/${(item as any)._highlightResult.productURL.value}`)
                        }
                    }
                ]
            },
            onSubmit({ state }) {
                if (state.query.trim()) {
                    router.push(`/products?search=${encodeURIComponent(state.query.trim())}`)
                }
            }
        })

        return () => {
            autocompleteInstance.destroy()
        }
    }, [appId, apiKey, indexName, querySuggestionsIndex, router])

    return (
        <div className="w-full mx-auto">
            <div ref={containerRef} />
            <style jsx global>{`
        .aa-Form {
          @apply join w-full;
        }
        .aa-InputWrapperPrefix {
          @apply btn btn-ghost join-item;
        }
        .aa-InputWrapper {
          @apply join-item w-full;
        }
        .aa-Input {
          @apply input input-bordered w-full join-item focus:outline-none focus:ring-2 focus:ring-accent;
        }
        .aa-InputWrapperSuffix {
          @apply btn btn-outline btn-accent join-item;
        }
        .aa-SubmitButton {
          @apply btn btn-outline btn-accent join-item flex items-center justify-center;
        }
        .aa-SubmitIcon {
          @apply w-5 h-5;
        }
        .aa-Panel {
          @apply absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50;
        }
        .aa-PanelLayout {
          @apply divide-y divide-gray-100;
        }
        .aa-Source {
          @apply py-2;
        }
        .aa-SourceHeaderTitle {
          @apply px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b;
        }
        .aa-List {
          @apply divide-y divide-gray-100;
        }
        .aa-Item {
          @apply cursor-pointer transition-colors duration-150;
        }
        .aa-Item[aria-selected="true"] {
          @apply bg-gray-50;
        }
        .aa-ItemWrapper {
          @apply flex items-center gap-3 px-3 py-2;
        }
        .aa-ItemContent {
          @apply flex items-center gap-3 w-full;
        }
        .aa-ItemIcon img {
          @apply w-10 h-10 object-cover rounded;
        }
        .aa-ItemIcon--noPicture {
          @apply w-10 h-10 bg-gray-200 rounded flex items-center justify-center;
        }
        .aa-ItemContentBody {
          @apply flex-1 min-w-0;
        }
        .aa-ItemContentTitle {
          @apply font-medium text-gray-900 truncate;
        }
        .aa-ItemContentDescription {
          @apply text-sm text-gray-500;
        }
      `}</style>
        </div>
    )
}

export default AlgoliaSearch
