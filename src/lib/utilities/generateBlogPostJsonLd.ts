import BlogDataModel from "../types/BlogDataModel";
import SiteDataModel from "../types/SiteDataModel";

export default function generateBlogPostJsonLd(data: BlogDataModel, siteData: SiteDataModel) {
  return {
    __html: `{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${data.title}",
      "image": "${data.featuredImage}",
      "datePublished": "${new Date(data.posted).toISOString()}",
      "dateModified": "${new Date(data.updated).toISOString()}",
      "author": [{
          "@type": "Person",
          "name": "${data.author.name}",
        }],
      "publisher":
        {
          "name": "${siteData.title}",
          "url": "${siteData.url}"
        },
    }
  `,
  };
}