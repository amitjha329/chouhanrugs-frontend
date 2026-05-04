import BlogDataModel from "../types/BlogDataModel";
import SiteDataModel from "../types/SiteDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";

export default function generateBlogPostJsonLd(data: BlogDataModel, siteData: SiteDataModel, locale: Locale = 'en-US') {
  const title = resolveLocalizedString(data.title, locale)
  return {
    __html: `{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title.replace(/"/g, '\\"')}",
      "image": "${data.featuredImage}",
      "datePublished": "${new Date(data.posted).toISOString()}",
      "dateModified": "${new Date(data.updated).toISOString()}",
      "author": [{
          "@type": "Person",
          "name": "${data.author.name.replace(/"/g, '\\"')}"
        }],
      "publisher":
        {
          "name": "${siteData.title.replace(/"/g, '\\"')}",
          "url": "${siteData.url}"
        }
    }
  `,
  };
}
