import { ProductDataModelWithColorMap, Variation } from "@/types/ProductDataModel";

export function extractColorsAndSizes(product:ProductDataModelWithColorMap) {
    const colors:string[] = [];
    const sizes:string[] = [];
  
    product.variations.forEach((variation:Variation) => {
      if (variation.variationSize && !sizes.includes(variation.variationSize)) {
        sizes.push(variation.variationSize);
      }
      if (variation.variationColor && !colors.includes(variation.variationColor)) {
        colors.push(variation.variationColor);
      }
    });
    return { colors, sizes };
  }