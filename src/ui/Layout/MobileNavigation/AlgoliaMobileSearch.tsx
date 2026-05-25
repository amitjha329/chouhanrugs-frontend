'use client'
import React, { useRef, useEffect } from 'react'
import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { useLocale } from 'next-intl'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'

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
  const searchClientRef = useRef(algoliasearch(appId, apiKey))
  const locale = useLocale() as Locale

  useEffect(() => {
    if (!containerRef.current) return
    const searchClient = searchClientRef.current

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
      placeholder: 'Search rugs, bags & more...',
      openOnFocus: true,
      detachedMediaQuery: 'none',
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      getSources() {
        return [
          {
            sourceId: 'products',
            getItems({ query }: { query: string }) {
              if (!query) return []

              return searchClient.search({
                requests: [{
                  indexName,
                  query,
                  hitsPerPage: 4,
                  attributesToRetrieve: ['objectID', 'productName', 'productTitle', 'productSellingPrice', 'images', 'productURL']
                }]
              }).then(({ results }) => (results[0] as any).hits as any[])
            },
            templates: {
              item({ item, html }) {
                const productName = resolveLocalizedString((item as any).productTitle, locale) || resolveLocalizedString((item as any).productName, locale)
                return html`
                  <div class="aa-ItemWrapper">
                    <div class="aa-ItemContent">
                      <div class="aa-ItemIcon aa-imageIcon">
                        <img src="${(item as any).productFeaturedImage || (item as any).images[0]}" alt="${productName}"/>
                      </div>
                      <div class="aa-ItemContentBody">
                        <div class="aa-ItemContentTitle">
                          ${productName}
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
              const productURL = resolveLocalizedString((item as any).productURL, locale)
              window.location.href = `/products/${encodeURIComponent(productURL)}`
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
  }, [appId, apiKey, indexName, querySuggestionsIndex, locale])

  return (
    <div className="w-full" id="mobile_algolia_search">
      <div ref={containerRef} />
      <style jsx global>{`
        /* Mobile-specific Algolia styles */
        .aa-Form {
          @apply relative flex w-full items-center overflow-hidden rounded-xl border border-primary/15 bg-white shadow-sm;
        }
        
        .aa-InputWrapper {
          @apply relative w-full;
        }
        
        .aa-Input {
          @apply h-10 w-full border-0 bg-transparent pl-10 pr-12 text-[13px] text-base-content placeholder:text-base-content/45 focus:outline-none focus:ring-0;
        }
        
        .aa-SubmitButton {
          @apply absolute left-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-primary;
        }
        
        .aa-SubmitIcon {
          @apply h-4 w-4;
        }
        
        .aa-Panel {
          @apply absolute left-4 right-4 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-xl;
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
