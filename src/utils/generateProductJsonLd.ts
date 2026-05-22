import { ProductDataModel } from "../types/ProductDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";

export default function generateProductJsonLd(productData: ProductDataModel, locale: Locale = 'en-US') {
  const name = (resolveLocalizedString(productData.productTitle, locale) || resolveLocalizedString(productData.productName, locale)).replace(/"/g, '\\"')
  const desc = resolveLocalizedString(productData.productDescriptionShort, locale).replace(/"/g, '\\"')
  const sku = (productData.sku || productData.itemCode || productData.addedOn).toString().replace(/"/g, '\\"')
  const mpn = (productData.gtin || productData.itemCode || productData.addedOn).toString().replace(/"/g, '\\"')
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
      "image": "${productData.images[productData.productPrimaryImageIndex] ?? productData.images[0]}",
      "description": "${desc}",
      "sku": "${sku}",
      "mpn": "${mpn}",
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
