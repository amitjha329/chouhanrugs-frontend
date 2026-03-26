import { ProductDataModel } from "../types/ProductDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";

export default function generateProductJsonLd(productData: ProductDataModel, locale: Locale = 'en-IN') {
  const name = resolveLocalizedString(productData.productName, locale).replace(/"/g, '\\"')
  const desc = resolveLocalizedString(productData.productDescriptionShort, locale).replace(/"/g, '\\"')
  // "aggregateRating": {
  //       "@type": "AggregateRating",
  //       "ratingValue": "${productData.productReviews.average}",
  //       "reviewCount": "${productData.productReviews.totalReviews}"
  //     },
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${name}",
      "image": "${productData.images[0]}",
      "description": "${desc}",
      "sku": "${productData.addedOn}",
      "mpn": "${productData.addedOn}",
      "brand": {
        "@type": "Brand",
        "name": "${productData.productBrand}"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "${productData.productSellingPrice}",
        "availability": "https://schema.org/InStock"
      }
    }
  `,
  };
}