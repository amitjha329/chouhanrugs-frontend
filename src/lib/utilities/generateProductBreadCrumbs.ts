import { ProductDataModel } from "../types/ProductDataModel";
import SiteDataModel from "../types/SiteDataModel";

export default function generateProductBreadCrumbs(productData: ProductDataModel, siteData: SiteDataModel) {
  return {
    __html: `{
          "@context": "https://schema.org/",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${siteData.url}/"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "${siteData.url}/products/"
          },{
            "@type": "ListItem",
            "position": 3,
            "name": "${productData.productCategory}",
            "item": "${siteData.url}/products/category/${productData.productCategory}"
          },{
            "@type": "ListItem",
            "position": 4,
            "name": "${productData.productName}"
          }]
        }
        `};
}