'use client'
import React, { useRef, useEffect } from 'react'
import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import '@algolia/autocomplete-theme-classic'
import { useLocale } from 'next-intl'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { localizePathname, type Locale } from '@/i18n/routing'

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
    const searchClientRef = useRef(algoliasearch(appId, apiKey))
    const locale = useLocale() as Locale

    useEffect(() => {
        if (!containerRef.current) return
        const searchClient = searchClientRef.current

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

        const plugins: any[] = [recentSearchesPlugin]

        if (querySuggestionsIndex) plugins.push(createQuerySuggestionsPlugin({
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
        }))

        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: 'Search for products...',
            openOnFocus: true,
            detachedMediaQuery: 'none',
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
                                    hitsPerPage: 6,
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
                      <div class="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop aa-imageIcon">
                      <img src="${productImage}" alt="${productName}"/>
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
        <div className="w-full mx-auto" id="desktop_algolia_search">
            <div ref={containerRef} />
            <style jsx global>{`
        #desktop_algolia_search .aa-Form {
          position: relative;
          display: flex;
          width: 100%;
          height: 3.25rem;
          align-items: center;
          overflow: visible;
          border: 1px solid rgba(108, 70, 36, 0.16);
          border-radius: 1rem;
          background: #fffdf9;
          box-shadow: 0 12px 28px rgba(69, 42, 22, 0.08);
        }

        #desktop_algolia_search .aa-Form:focus-within {
          border-color: rgba(108, 70, 36, 0.38);
          background: #ffffff;
          box-shadow: 0 16px 36px rgba(69, 42, 22, 0.12);
        }

        #desktop_algolia_search .aa-InputWrapper {
          position: relative;
          width: 100%;
        }

        #desktop_algolia_search .aa-Input {
          width: 100%;
          height: 3rem;
          border: 0;
          border-radius: 1rem;
          background: transparent;
          padding: 0 1rem 0 3.5rem;
          color: #2a1a10;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          box-shadow: none;
        }

        #desktop_algolia_search .aa-Input::placeholder {
          color: #8f857c;
          opacity: 1;
        }

        #desktop_algolia_search .aa-InputWrapperPrefix {
          position: absolute;
          left: 0.7rem;
          top: 50%;
          z-index: 10;
          display: flex;
          width: 2.15rem;
          height: 2.15rem;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border-radius: 999px;
          background: #f4ebe4;
          color: #6c4624;
        }

        #desktop_algolia_search .aa-SubmitButton {
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

        #desktop_algolia_search .aa-SubmitIcon {
          width: 1.2rem;
          height: 1.2rem;
          color: currentColor;
        }

        #desktop_algolia_search .aa-InputWrapperSuffix,
        #desktop_algolia_search .aa-LoadingIndicator,
        #desktop_algolia_search .aa-ClearButton {
          display: none;
        }

        #desktop_algolia_search .aa-Panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 50;
          margin-top: 0.5rem;
          max-height: 20rem;
          overflow-y: auto;
          border: 1px solid rgba(108, 70, 36, 0.1);
          border-radius: 1rem;
          background: #fffdf9;
          box-shadow: 0 18px 40px rgba(69, 42, 22, 0.16);
        }

        #desktop_algolia_search .aa-PanelLayout {
          overflow: hidden;
        }

        #desktop_algolia_search .aa-Source {
          padding: 0.35rem 0;
        }

        #desktop_algolia_search .aa-SourceHeaderTitle {
          padding: 0.55rem 0.85rem;
          border-bottom: 1px solid rgba(108, 70, 36, 0.08);
          background: #f8f3ee;
          color: #6b625b;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        #desktop_algolia_search .aa-List {
          border-top: 1px solid rgba(108, 70, 36, 0.06);
        }

        #desktop_algolia_search .aa-Item {
          cursor: pointer;
          transition: background-color 150ms ease;
        }

        #desktop_algolia_search .aa-Item[aria-selected="true"] {
          background: #f4ebe4;
        }

        #desktop_algolia_search .aa-ItemWrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.85rem;
        }

        #desktop_algolia_search .aa-ItemContent {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 0.75rem;
        }

        #desktop_algolia_search .aa-imageIcon {
          width: 2.75rem !important;
          height: 2.75rem !important;
        }

        #desktop_algolia_search .aa-ItemIcon img {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.45rem;
          object-fit: cover;
        }

        #desktop_algolia_search .aa-ItemIcon--noPicture {
          display: flex;
          width: 2.75rem;
          height: 2.75rem;
          align-items: center;
          justify-content: center;
          border-radius: 0.45rem;
          background: #eee5dd;
        }

        #desktop_algolia_search .aa-ItemContentBody {
          min-width: 0;
          flex: 1;
        }

        #desktop_algolia_search .aa-ItemContentTitle {
          overflow: hidden;
          color: #2a1a10;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.92rem;
          font-weight: 600;
        }

        #desktop_algolia_search .aa-ItemContentDescription {
          color: #6b625b;
          font-size: 0.8rem;
        }
      `}</style>
        </div>
    )
}

export default AlgoliaSearch
