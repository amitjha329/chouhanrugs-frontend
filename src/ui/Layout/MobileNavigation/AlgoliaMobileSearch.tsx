'use client'
import React, { useRef, useEffect } from 'react'
import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { algoliasearch } from 'algoliasearch'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AlgoliaMobileSearchProps {
  appId: string
  apiKey: string
  indexName: string
  querySuggestionsIndex: string
}

const AlgoliaMobileSearch: React.FC<AlgoliaMobileSearchProps> = ({
  appId,
  apiKey,
  indexName,
  querySuggestionsIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const searchClient = algoliasearch(appId, apiKey)

  useEffect(() => {
    if (!containerRef.current) return

    // Recent searches plugin
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'chouhanrugs-recent-searches-mobile',
      limit: 3,
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
          hitsPerPage: 5
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
      placeholder: 'Search',
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
                  hitsPerPage: 4,
                  attributesToRetrieve: ['objectID', 'productName', 'productSellingPrice', 'images', 'productURL']
                }
              }).then(({ hits }) => hits)
            },
            templates: {
              item({ item, html }) {
                return html`
                  <div class="aa-ItemWrapper">
                    <div class="aa-ItemContent">
                      <div class="aa-ItemIcon aa-imageIcon">
                        <img src="${(item as any).images[0]}" alt="${(item as any).productName}"/>
                      </div>
                      <div class="aa-ItemContentBody">
                        <div class="aa-ItemContentTitle">
                          ${(item as any).productName}
                        </div>
                        <div class="aa-ItemContentDescription">
                          $${(item as any).productSellingPrice}
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
              window.location.href = `/products/${(item as any).productURL}`
            }
          }
        ]
      },
      onSubmit({ state }) {
        if (state.query.trim()) {
          window.location.href = `/products?search=${encodeURIComponent(state.query.trim())}`
        }
      }
    })

    return () => {
      autocompleteInstance.destroy()
    }
  }, [appId, apiKey, indexName, querySuggestionsIndex])

  return (
    <div className="w-full">
      <div ref={containerRef} />
      <style jsx global>{`
        /* Mobile-specific Algolia styles */
        .aa-Form {
          @apply join join-horizontal w-full;
        }
        
        .aa-InputWrapper {
          @apply join-item w-full relative;
        }
        
        .aa-Input {
          @apply join-item input input-md input-bordered border-r-0 rounded-l-full w-full;
          @apply placeholder:text-primary focus:outline-none focus:ring-0 focus:border-gray-300;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        
        .aa-SubmitButton {
          @apply join-item btn btn-outline btn-md border-l-0 rounded-r-full border-gray-300;
          @apply flex items-center justify-center hover:bg-gray-50;
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }
        
        .aa-SubmitIcon {
          @apply w-5 h-5;
        }
        
        .aa-Panel {
          @apply absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1;
          @apply max-h-80 overflow-y-auto z-50;
        }
        
        .aa-PanelLayout {
          @apply divide-y divide-gray-100;
        }
        
        .aa-Source {
          @apply py-1;
        }
        
        .aa-SourceHeaderTitle {
          @apply px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50;
        }
        
        .aa-List {
          @apply divide-y divide-gray-50;
        }
        
        .aa-Item {
          @apply cursor-pointer transition-colors duration-150;
        }
        
        .aa-Item[aria-selected="true"] {
          @apply bg-blue-50;
        }
        
        .aa-ItemWrapper {
          @apply flex items-center px-3 py-2;
        }
        
        .aa-ItemContent {
          @apply flex items-center gap-2 w-full;
        }
        
        .aa-ItemIcon {
          @apply flex-shrink-0;
        }
        
        .aa-ItemIcon img {
          @apply w-8 h-8 object-cover rounded;
        }
        
        .aa-ItemIcon--noPicture {
          @apply w-8 h-8 bg-gray-200 rounded flex items-center justify-center;
        }
        
        .aa-ItemContentBody {
          @apply flex-1 min-w-0;
        }
        
        .aa-ItemContentTitle {
          @apply font-medium text-gray-900 truncate text-sm;
        }
        
        .aa-ItemContentDescription {
          @apply text-xs text-gray-500;
        }
        
        /* Hide default Algolia styles that conflict with DaisyUI */
        .aa-InputWrapperPrefix,
        .aa-InputWrapperSuffix,
        .aa-LoadingIndicator,
        .aa-ClearButton {
          @apply hidden;
        }
        
        /* Ensure proper text rendering (not HTML) */
        .aa-ItemContentTitle,
        .aa-ItemContentDescription,
        .aa-SourceHeaderTitle {
          white-space: normal;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .aa-Panel {
            @apply mx-0;
          }
          
          .aa-ItemContentTitle {
            @apply text-xs;
          }
          
          .aa-ItemContentDescription {
            @apply text-xs;
          }
        }
      `}</style>
    </div>
  )
}

export default AlgoliaMobileSearch
