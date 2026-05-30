'use client'
import React, { useRef, useEffect } from 'react'
import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { useLocale } from 'next-intl'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { localizePathname, type Locale } from '@/i18n/routing'

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

    const plugins: any[] = [recentSearchesPlugin]

    if (querySuggestionsIndex) plugins.push(createQuerySuggestionsPlugin({
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
    }))

    const autocompleteInstance = autocomplete({
      container: containerRef.current,
      placeholder: 'Search rugs, bags & more...',
      openOnFocus: true,
      detachedMediaQuery: 'none',
      panelPlacement: 'full-width',
      classNames: {
        root: 'cr-mobile-search-root',
        form: 'cr-mobile-search-form',
        input: 'cr-mobile-search-input',
        inputWrapper: 'cr-mobile-search-input-wrapper',
        inputWrapperPrefix: 'cr-mobile-search-prefix',
        inputWrapperSuffix: 'cr-mobile-search-suffix',
        item: 'cr-mobile-search-item',
        list: 'cr-mobile-search-list',
        panel: 'cr-mobile-search-panel',
        panelLayout: 'cr-mobile-search-panel-layout',
        source: 'cr-mobile-search-source',
        sourceHeader: 'cr-mobile-search-source-header',
        submitButton: 'cr-mobile-search-submit'
      },
      plugins,
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
                  attributesToRetrieve: ['objectID', 'productName', 'productTitle', 'productSellingPrice', 'productFeaturedImage', 'images', 'productURL']
                }]
              }).then(({ results }) => (results[0] as any).hits as any[])
            },
            templates: {
              item({ item, html }) {
                const productName = resolveLocalizedString((item as any).productName, locale) || resolveLocalizedString((item as any).productTitle, locale)
                const productImage = (item as any).productFeaturedImage || (item as any).images?.[0] || ''
                return html`
                  <div class="aa-ItemWrapper">
                    <div class="aa-ItemContent">
                      <div class="aa-ItemIcon aa-imageIcon">
                        <img src="${productImage}" alt="${productName}" loading="lazy" decoding="async" fetchpriority="low"/>
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
              if (productURL) window.location.href = localizePathname(`/products/${encodeURIComponent(productURL)}`, locale)
            }
          }
        ]
      },
      onSubmit({ state }) {
        if (state.query.trim()) {
          window.location.href = localizePathname(`/products?search=${encodeURIComponent(state.query.trim())}`, locale)
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
        #mobile_algolia_search {
          position: relative;
          z-index: 80;
        }

        #mobile_algolia_search .aa-Autocomplete {
          position: relative;
        }

        /* Mobile-specific Algolia styles */
        #mobile_algolia_search .aa-Form,
        #mobile_algolia_search .cr-mobile-search-form {
          position: relative;
          display: flex;
          width: 100%;
          height: 3rem;
          align-items: center;
          overflow: visible;
          border: 1px solid rgba(108, 70, 36, 0.15);
          border-radius: 1rem;
          background: #fffdf9;
          box-shadow: 0 10px 24px rgba(69, 42, 22, 0.08);
        }
        
        #mobile_algolia_search .aa-InputWrapper,
        #mobile_algolia_search .cr-mobile-search-input-wrapper {
          position: relative;
          width: 100%;
        }
        
        #mobile_algolia_search .aa-Input,
        #mobile_algolia_search .cr-mobile-search-input {
          width: 100%;
          height: 2.75rem;
          border: 0;
          border-radius: 1rem;
          background: transparent;
          padding: 0 1rem 0 3rem;
          color: #2a1a10;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1;
          outline: none;
          box-shadow: none;
        }

        #mobile_algolia_search .aa-Input::placeholder,
        #mobile_algolia_search .cr-mobile-search-input::placeholder {
          color: #9b928b;
          opacity: 1;
        }

        #mobile_algolia_search .aa-Input:focus,
        #mobile_algolia_search .cr-mobile-search-input:focus {
          outline: none;
          box-shadow: none;
        }
        
        #mobile_algolia_search .aa-InputWrapperPrefix,
        #mobile_algolia_search .cr-mobile-search-prefix {
          position: absolute;
          left: 0.5rem;
          top: 50%;
          z-index: 10;
          display: flex;
          width: 2rem;
          height: 2rem;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border: 0;
          border-radius: 999px;
          background: #f4ebe4;
          color: #6c4624;
        }

        #mobile_algolia_search .aa-SubmitButton,
        #mobile_algolia_search .cr-mobile-search-submit {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          color: inherit;
          padding: 0;
        }
        
        #mobile_algolia_search .aa-SubmitIcon,
        #mobile_algolia_search .cr-mobile-search-submit .aa-SubmitIcon {
          width: 1.125rem;
          height: 1.125rem;
          color: currentColor;
        }

        #mobile_algolia_search .aa-Form:focus-within,
        #mobile_algolia_search .cr-mobile-search-form:focus-within {
          border-color: rgba(108, 70, 36, 0.35);
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(69, 42, 22, 0.12);
        }
        
        #mobile_algolia_search .aa-Panel,
        .cr-mobile-search-panel {
          position: fixed !important;
          left: 0.75rem !important;
          right: 0.75rem !important;
          top: 6.65rem !important;
          z-index: 10020;
          width: auto !important;
          max-width: none !important;
          margin-top: 0;
          max-height: min(65vh, 28rem);
          overflow-y: auto;
          border: 1px solid rgba(108, 70, 36, 0.14);
          border-radius: 1.125rem;
          background: #fffdf9;
          box-shadow: 0 20px 48px rgba(69, 42, 22, 0.18);
          scrollbar-width: thin;
          scrollbar-color: rgba(108, 70, 36, 0.35) transparent;
        }
        
        #mobile_algolia_search .aa-PanelLayout,
        .cr-mobile-search-panel-layout {
          overflow: hidden;
          background: linear-gradient(180deg, #fffdf9 0%, #fff8f1 100%);
          max-height: none !important;
        }
        
        #mobile_algolia_search .aa-Source,
        .cr-mobile-search-source {
          padding: 0.35rem;
        }
        
        #mobile_algolia_search .aa-SourceHeader,
        .cr-mobile-search-source-header {
          padding: 0;
        }

        #mobile_algolia_search .aa-SourceHeaderTitle,
        .cr-mobile-search-panel .aa-SourceHeaderTitle {
          padding: 0.45rem 0.55rem 0.35rem;
          color: #6c4624;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
        }
        
        #mobile_algolia_search .aa-List,
        .cr-mobile-search-list {
          display: grid;
          gap: 0.25rem;
          border-top: 1px solid rgba(108, 70, 36, 0.06);
          padding-top: 0.25rem;
        }
        
        #mobile_algolia_search .aa-Item,
        .cr-mobile-search-item {
          border-radius: 0.75rem;
          cursor: pointer;
          transition: background-color 150ms ease, box-shadow 150ms ease;
        }
        
        #mobile_algolia_search .aa-Item[aria-selected="true"],
        .cr-mobile-search-item[aria-selected="true"] {
          background: #f4ebe4;
          box-shadow: inset 0 0 0 1px rgba(108, 70, 36, 0.08);
        }
        
        #mobile_algolia_search .aa-ItemWrapper,
        .cr-mobile-search-panel .aa-ItemWrapper {
          display: flex;
          align-items: center;
          padding: 0.55rem 0.6rem;
        }
        
        #mobile_algolia_search .aa-ItemContent,
        .cr-mobile-search-panel .aa-ItemContent {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 0.65rem;
        }
        
        #mobile_algolia_search .aa-ItemIcon,
        .cr-mobile-search-panel .aa-ItemIcon {
          flex-shrink: 0;
        }

        #mobile_algolia_search .aa-imageIcon,
        .cr-mobile-search-panel .aa-imageIcon {
          width: 2.35rem !important;
          height: 2.35rem !important;
          overflow: hidden;
          border-radius: 0.55rem;
          background: #eee5dd;
        }
        
        #mobile_algolia_search .aa-ItemIcon img,
        .cr-mobile-search-panel .aa-ItemIcon img {
          width: 2.35rem !important;
          height: 2.35rem !important;
          border-radius: 0.55rem;
          object-fit: cover;
        }
        
        #mobile_algolia_search .aa-ItemIcon--noPicture,
        .cr-mobile-search-panel .aa-ItemIcon--noPicture {
          display: flex;
          width: 2.35rem;
          height: 2.35rem;
          align-items: center;
          justify-content: center;
          border-radius: 0.55rem;
          background: #eee5dd;
        }
        
        #mobile_algolia_search .aa-ItemContentBody,
        .cr-mobile-search-panel .aa-ItemContentBody {
          min-width: 0;
          flex: 1;
        }
        
        #mobile_algolia_search .aa-ItemContentTitle,
        .cr-mobile-search-panel .aa-ItemContentTitle {
          overflow: hidden;
          color: #2a1a10;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
        }
        
        #mobile_algolia_search .aa-ItemContentDescription,
        .cr-mobile-search-panel .aa-ItemContentDescription {
          margin-top: 0.1rem;
          color: #7a4e27;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1.1;
        }
        
        /* Hide default Algolia styles that conflict with DaisyUI */
        #mobile_algolia_search .aa-InputWrapperSuffix,
        #mobile_algolia_search .cr-mobile-search-suffix,
        #mobile_algolia_search .aa-LoadingIndicator,
        #mobile_algolia_search .aa-ClearButton {
          display: none;
        }
        
        /* Ensure proper text rendering (not HTML) */
        #mobile_algolia_search .aa-ItemContentTitle,
        #mobile_algolia_search .aa-ItemContentDescription,
        #mobile_algolia_search .aa-SourceHeaderTitle,
        .cr-mobile-search-panel .aa-ItemContentTitle,
        .cr-mobile-search-panel .aa-ItemContentDescription,
        .cr-mobile-search-panel .aa-SourceHeaderTitle {
          white-space: normal;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          #mobile_algolia_search .aa-ItemContentTitle {
            font-size: 0.75rem;
          }
          
          #mobile_algolia_search .aa-ItemContentDescription {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 370px) {
          #mobile_algolia_search .aa-Panel,
          .cr-mobile-search-panel {
            left: 0.5rem !important;
            right: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AlgoliaMobileSearch
