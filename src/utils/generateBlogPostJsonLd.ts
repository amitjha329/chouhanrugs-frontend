import BlogDataModel from "../types/BlogDataModel";
import SiteDataModel from "../types/SiteDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";
import { absoluteUrl, safeJsonLd } from "@/lib/seoCatalog";

export default function generateBlogPostJsonLd(data: BlogDataModel, siteData: SiteDataModel, locale: Locale = 'en-US') {
  const title = resolveLocalizedString(data.title, locale)
  const description = resolveLocalizedString(data.description, locale)

  return safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: data.featuredImage ? [absoluteUrl(siteData.url, data.featuredImage)] : undefined,
    datePublished: new Date(data.posted).toISOString(),
    dateModified: new Date(data.updated).toISOString(),
    author: [{
      "@type": "Person",
      name: data.author.name,
    }],
    publisher: {
      "@type": "Organization",
      name: siteData.title,
      url: siteData.url,
      logo: siteData.logoSrc ? absoluteUrl(siteData.url, siteData.logoSrc) : undefined,
    },
  });
}
