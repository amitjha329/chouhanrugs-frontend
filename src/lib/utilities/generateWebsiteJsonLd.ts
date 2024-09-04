import SiteDataModel from "../types/SiteDataModel";

export default function generateWebsiteJsonLd(siteData: SiteDataModel) {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${siteData.url}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${siteData.url}/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  `,
  };
}