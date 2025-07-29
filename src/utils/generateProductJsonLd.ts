import { ProductDataModel } from "../types/ProductDataModel";

export default function generateProductJsonLd(productData: ProductDataModel) {
  // "aggregateRating": {
  //       "@type": "AggregateRating",
  //       "ratingValue": "${productData.productReviews.average}",
  //       "reviewCount": "${productData.productReviews.totalReviews}"
  //     },
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${productData.productName}",
      "image": "${productData.images[0]}",
      "description": "${productData.productDescriptionShort}",
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