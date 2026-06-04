/**
 * Image Optimization Utilities for Next.js 16
 * 
 * Provides blur placeholder generation, progressive image loading helpers,
 * and optimized image component configurations.
 */

/**
 * Generate a shimmer SVG placeholder for blur effect
 * This creates a lightweight animated placeholder that displays while the image loads
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

/**
 * Convert SVG to base64 data URL for use as blur placeholder
 */
export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

/**
 * Generate a shimmer blur data URL for Next.js Image placeholder
 * @param width - Width of the shimmer effect
 * @param height - Height of the shimmer effect
 * @returns Base64 encoded data URL for use with Image placeholder="blur" blurDataURL
 */
export const getShimmerBlurDataURL = (width: number = 100, height: number = 100): string =>
  `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`

/**
 * Generate a solid color blur placeholder
 * @param color - Hex color code (without #)
 * @returns Base64 encoded data URL
 */
export const getColorPlaceholder = (color: string = 'f3f4f6'): string => {
  const svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#${color}"/></svg>`
  return `data:image/svg+xml;base64,${toBase64(svg)}`
}

/**
 * Generate a gradient blur placeholder
 * @param startColor - Start color (hex without #)
 * @param endColor - End color (hex without #)
 * @returns Base64 encoded data URL
 */
export const getGradientPlaceholder = (startColor: string = 'f3f4f6', endColor: string = 'e5e7eb'): string => {
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${endColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#grad)"/>
    </svg>`
  return `data:image/svg+xml;base64,${toBase64(svg)}`
}

/**
 * Default responsive sizes for product images
 * Use these with the Next.js Image `sizes` prop
 */
export const productImageSizes = {
  // Main product image
  main: "(max-width: 640px) 92vw, (max-width: 1024px) 56vw, 720px",
  // Product card/grid image
  card: "(max-width: 640px) 44vw, (max-width: 1024px) 31vw, 280px",
  // Thumbnail image
  thumbnail: "80px",
  // Gallery image
  gallery: "(max-width: 640px) 95vw, (max-width: 1024px) 72vw, 960px",
}

/**
 * Quality presets by rendered image size.
 * Width selection comes from the `sizes` prop; quality stays intentionally low
 * because larger rendered dimensions preserve enough visual detail.
 * These values must match next.config.ts images.qualities.
 */
export const imageQuality = {
  thumbnail: 10,
  preview: 20,
  standard: 30,
  high: 50,
  maximum: 50,
}

const numericSize = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return undefined

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const largestPixelSizeFromSizes = (sizes: string): number | undefined => {
  const pixelValues = Array.from(sizes.matchAll(/(\d+(?:\.\d+)?)px/g))
    .map((match) => Number.parseFloat(match[1]))
    .filter(Number.isFinite)

  return pixelValues.length > 0 ? Math.max(...pixelValues) : undefined
}

const largestViewportWidthFromSizes = (sizes: string): number | undefined => {
  const viewportValues = Array.from(sizes.matchAll(/(\d+(?:\.\d+)?)vw/g))
    .map((match) => Number.parseFloat(match[1]))
    .filter(Number.isFinite)

  return viewportValues.length > 0 ? Math.max(...viewportValues) : undefined
}

export const qualityForImageSize = (input: {
  width?: unknown
  height?: unknown
  sizes?: string
}): number => {
  const width = numericSize(input.width)
  const height = numericSize(input.height)
  const maxFixedSize = Math.max(width ?? 0, height ?? 0)

  if (maxFixedSize > 0) {
    if (maxFixedSize <= 96) return imageQuality.thumbnail
    if (maxFixedSize <= 256) return imageQuality.preview
    if (maxFixedSize <= 640) return imageQuality.standard
    return imageQuality.high
  }

  if (input.sizes) {
    const pixelSize = largestPixelSizeFromSizes(input.sizes)
    if (pixelSize !== undefined) {
      if (pixelSize <= 96) return imageQuality.thumbnail
      if (pixelSize <= 256) return imageQuality.preview
      if (pixelSize <= 640) return imageQuality.standard
      return imageQuality.high
    }

    const viewportWidth = largestViewportWidthFromSizes(input.sizes)
    if (viewportWidth !== undefined) {
      if (viewportWidth <= 25) return imageQuality.preview
      if (viewportWidth <= 60) return imageQuality.standard
      return imageQuality.high
    }
  }

  return imageQuality.standard
}

/**
 * Pre-generate common blur placeholders for instant use
 * These are static and can be used directly without runtime generation
 */
export const blurPlaceholders = {
  // Light gray shimmer effect
  shimmer: getShimmerBlurDataURL(100, 100),
  // Solid light gray
  gray: getColorPlaceholder('f3f4f6'),
  // Light beige (good for rug products)
  beige: getColorPlaceholder('f5f5dc'),
  // Warm neutral
  warmNeutral: getColorPlaceholder('faf5f0'),
  // Gradient placeholder
  gradient: getGradientPlaceholder('f3f4f6', 'e5e7eb'),
}

export default {
  shimmer,
  toBase64,
  getShimmerBlurDataURL,
  getColorPlaceholder,
  getGradientPlaceholder,
  productImageSizes,
  imageQuality,
  qualityForImageSize,
  blurPlaceholders,
}
