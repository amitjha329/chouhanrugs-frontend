import BlogDataModel from "../types/BlogDataModel";
import SiteDataModel from "../types/SiteDataModel";

export default function generateBlogPostJsonLd(data: BlogDataModel, siteData: SiteDataModel) {
  return {
    __html: `{
          "@context": "https://schema.org/",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${siteData.url}"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "Blogs",
            "item": "${siteData.url}/blog/"
          },{
            "@type": "ListItem",
            "position": 4,
            "name": "${data.title}"
          }]
        }
        `};
}