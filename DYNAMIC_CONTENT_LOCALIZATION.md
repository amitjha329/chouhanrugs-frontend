# Dynamic Content Localization Guide

This document explains how to localize dynamic content that comes from the backend (MongoDB) — such as product names, descriptions, blog posts, category names, and other user-generated or CMS-managed content.

## Table of Contents

- [Overview](#overview)
- [Static vs Dynamic Content](#static-vs-dynamic-content)
- [Approach 1: Multi-Language Fields in MongoDB](#approach-1-multi-language-fields-in-mongodb)
- [Approach 2: Separate Translation Collection](#approach-2-separate-translation-collection)
- [Approach 3: Translation API / Service](#approach-3-translation-api--service)
- [Implementation Guide](#implementation-guide)
- [Frontend Integration](#frontend-integration)
- [CRM / Admin Panel Changes](#crm--admin-panel-changes)
- [SEO Considerations](#seo-considerations)
- [Best Practices](#best-practices)

---

## Overview

The project uses **next-intl** for static UI string translations (buttons, labels, headings, etc.) stored in `messages/*.json` files. However, **dynamic content** — data fetched from the backend API / MongoDB — requires a different strategy since it's not known at build time.

### Supported Locales

| Code    | Language          |
|---------|-------------------|
| `en-IN` | English (India)   |
| `en-US` | English (US)      |
| `hi-IN` | Hindi (India)     |
| `en-GB` | English (UK)      |
| `ar`    | Arabic            |

---

## Static vs Dynamic Content

| Aspect        | Static (next-intl)                   | Dynamic (Backend)                      |
|---------------|--------------------------------------|----------------------------------------|
| Source        | `messages/*.json` files              | MongoDB collections                    |
| Examples      | "Add to Cart", "Checkout", headings  | Product names, descriptions, blog posts|
| Update method | Code changes / PR                    | Admin panel / CRM                      |
| Translation   | Manual per locale file               | Per-document in DB or translation API  |

---

## Approach 1: Multi-Language Fields in MongoDB (Recommended)

Store translations directly inside each document using locale-keyed sub-fields.

### Schema Design

```typescript
// Before (single language)
interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  // ...
}

// After (multi-language)
interface Product {
  _id: string;
  productName: {
    'en-IN': string;
    'en-US': string;
    'hi-IN': string;
    'en-GB': string;
    'ar': string;
  };
  productDescription: {
    'en-IN': string;
    'en-US': string;
    'hi-IN': string;
    'en-GB': string;
    'ar': string;
  };
  // Non-translatable fields remain flat
  productPrice: number;
  productImages: string[];
  slug: string;
}
```

### MongoDB Document Example

```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k",
  "productName": {
    "en-IN": "Handwoven Jute Rug - Natural",
    "en-US": "Handwoven Jute Rug - Natural",
    "hi-IN": "हाथ से बुना जूट गलीचा - प्राकृतिक",
    "en-GB": "Handwoven Jute Rug - Natural",
    "ar": "سجادة جوت منسوجة يدوياً - طبيعية"
  },
  "productDescription": {
    "en-IN": "Beautiful handcrafted jute rug made by skilled artisans...",
    "hi-IN": "कुशल कारीगरों द्वारा बनाया गया सुंदर हस्तनिर्मित जूट गलीचा...",
    "ar": "سجادة جوت جميلة مصنوعة يدوياً بواسطة حرفيين مهرة..."
  },
  "productPrice": 2499,
  "slug": "handwoven-jute-rug-natural"
}
```

### Backend API Changes

Create a utility to extract the correct locale field:

```typescript
// utils/getLocalizedField.ts
export function getLocalizedField(
  field: Record<string, string> | string,
  locale: string,
  fallbackLocale: string = 'en-IN'
): string {
  // Backward compatibility: if field is a plain string, return it
  if (typeof field === 'string') return field;

  // Try exact locale match
  if (field[locale]) return field[locale];

  // Try language-only match (e.g., 'en' for 'en-US')
  const lang = locale.split('-')[0];
  const langMatch = Object.keys(field).find(k => k.startsWith(lang));
  if (langMatch && field[langMatch]) return field[langMatch];

  // Fallback
  return field[fallbackLocale] || Object.values(field)[0] || '';
}
```

### API Endpoint Example

```typescript
// api/products/[slug]/route.ts
import { getLocalizedField } from '@/utils/getLocalizedField';

export async function GET(req: Request) {
  const locale = req.headers.get('x-locale') || 'en-IN';
  const product = await db.collection('products').findOne({ slug });

  return Response.json({
    ...product,
    productName: getLocalizedField(product.productName, locale),
    productDescription: getLocalizedField(product.productDescription, locale),
  });
}
```

---

## Approach 2: Separate Translation Collection

Keep the main collection unchanged and store translations in a dedicated collection.

### Schema

```typescript
// translations collection
interface Translation {
  _id: string;
  entityType: 'product' | 'category' | 'blog';
  entityId: string;       // Reference to original document
  locale: string;         // e.g., 'hi-IN'
  fields: {
    [fieldName: string]: string;  // e.g., { productName: "...", productDescription: "..." }
  };
}
```

### MongoDB Document

```json
{
  "_id": "tr_001",
  "entityType": "product",
  "entityId": "64a1b2c3d4e5f6g7h8i9j0k",
  "locale": "hi-IN",
  "fields": {
    "productName": "हाथ से बुना जूट गलीचा - प्राकृतिक",
    "productDescription": "कुशल कारीगरों द्वारा बनाया गया सुंदर हस्तनिर्मित जूट गलीचा..."
  }
}
```

### Query Helper

```typescript
async function getTranslatedProduct(productId: string, locale: string) {
  const [product, translation] = await Promise.all([
    db.collection('products').findOne({ _id: productId }),
    db.collection('translations').findOne({
      entityType: 'product',
      entityId: productId,
      locale
    })
  ]);

  if (translation) {
    return {
      ...product,
      ...translation.fields
    };
  }
  return product;
}
```

**Pros:** No schema migration for existing documents, translations are independent.  
**Cons:** Extra DB query per request, harder to keep in sync.

---

## Approach 3: Translation API / Service

Use an external translation service (Google Translate API, DeepL, AWS Translate) for automatic translation.

### Auto-Translation on Content Save

```typescript
// When admin saves a product (in CRM)
import { translate } from '@google-cloud/translate';

async function onProductSave(product: any) {
  const locales = ['hi-IN', 'ar', 'en-GB', 'en-US'];
  const sourceLocale = 'en-IN';

  const translations: Record<string, Record<string, string>> = {
    productName: { [sourceLocale]: product.productName },
    productDescription: { [sourceLocale]: product.productDescription }
  };

  for (const locale of locales) {
    const targetLang = locale.split('-')[0]; // 'hi', 'ar', 'en'

    for (const field of ['productName', 'productDescription']) {
      if (targetLang === sourceLocale.split('-')[0]) {
        // Same language family — copy with minor adjustments
        translations[field][locale] = product[field];
      } else {
        const [result] = await translate.translate(product[field], targetLang);
        translations[field][locale] = result;
      }
    }
  }

  // Save back to product document
  await db.collection('products').updateOne(
    { _id: product._id },
    { $set: translations }
  );
}
```

**Pros:** Fully automatic, no manual translation effort.  
**Cons:** Quality may vary for domain-specific terms, API costs, may need human review.

---

## Implementation Guide

### Step 1: Pass Locale to Server Actions

The current architecture uses Next.js server actions. Pass the active locale from the frontend:

```typescript
// In a Server Component
import { getLocale } from 'next-intl/server';

const ProductPage = async ({ params }) => {
  const locale = await getLocale();
  const product = await getProduct(params.slug, locale);
  // ...
};
```

```typescript
// In a Client Component
import { useLocale } from 'next-intl';

const ProductCard = ({ productId }) => {
  const locale = useLocale();

  useEffect(() => {
    fetchProduct(productId, locale).then(setProduct);
  }, [productId, locale]);
};
```

### Step 2: Update Server Actions

```typescript
// backend/serverActions/getProduct.ts
'use server'
import { getLocalizedField } from '@/utils/getLocalizedField';

export default async function getProduct(slug: string, locale: string = 'en-IN') {
  const product = await db.collection('products').findOne({ slug });

  return {
    ...product,
    productName: getLocalizedField(product.productName, locale),
    productDescription: getLocalizedField(product.productDescription, locale),
    // Keep non-translatable fields as-is
    productPrice: product.productPrice,
    productImages: product.productImages,
  };
}
```

### Step 3: Handle Fallbacks Gracefully

```typescript
// If a translation is missing for a locale, fall back to defaultLocale
// The getLocalizedField utility handles this automatically:
// 1. Try exact locale (e.g., 'hi-IN')
// 2. Try language family (e.g., 'hi')
// 3. Fall back to 'en-IN'
// 4. Fall back to first available value
```

---

## Frontend Integration

### Server Components

```tsx
import { getLocale } from 'next-intl/server';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const locale = await getLocale();
  const product = await getProduct(params.slug, locale);

  return (
    <div>
      <h1>{product.productName}</h1>
      <p>{product.productDescription}</p>
    </div>
  );
}
```

### Client Components

```tsx
'use client'
import { useLocale } from 'next-intl';

export default function DynamicContent({ content }: { content: Record<string, string> }) {
  const locale = useLocale();

  // content = { 'en-IN': 'Hello', 'hi-IN': 'नमस्ते', ... }
  const localizedText = content[locale] || content['en-IN'] || Object.values(content)[0];

  return <p>{localizedText}</p>;
}
```

---

## CRM / Admin Panel Changes

### Translation Editor UI

When editing a product in the CRM/Admin panel, add a tabbed interface for each locale:

```
┌──────────────────────────────────────────┐
│ Product: Handwoven Jute Rug              │
├──────────────────────────────────────────┤
│ [en-IN] [en-US] [hi-IN] [en-GB] [ar]    │
├──────────────────────────────────────────┤
│ Product Name: __________________________ │
│ Description:  __________________________ │
│               __________________________ │
│ [Auto-Translate from en-IN]  [Save]      │
└──────────────────────────────────────────┘
```

### Fields That Should Be Translated

| Collection   | Translatable Fields                        | Non-Translatable Fields     |
|-------------|--------------------------------------------|-----------------------------|
| Products    | name, description, highlights, care guide  | price, SKU, images, slug    |
| Categories  | name, description                          | slug, image, parent ID      |
| Blog Posts  | title, content, excerpt                    | slug, author, date, images  |
| Banners     | heading, subtext, CTA text                 | image URL, link, position   |
| Pages       | title, body content                        | slug, template              |

### Fields That Should NOT Be Translated

- Prices, SKUs, barcodes
- Image URLs and file paths
- Slugs and URL identifiers
- Dates, timestamps
- Configuration values
- User-specific data (addresses, order IDs)

---

## SEO Considerations

### 1. Localized Slugs (Optional)

```json
{
  "slug": {
    "en-IN": "handwoven-jute-rug",
    "hi-IN": "haath-se-buna-jute-galeesha",
    "ar": "سجادة-جوت-منسوجة"
  }
}
```

### 2. hreflang Tags

Already handled by next-intl's routing for static pages. For dynamic pages, ensure the locale is in the URL:

```
/en-US/product/handwoven-jute-rug
/hi-IN/product/handwoven-jute-rug
```

### 3. Localized Meta Tags

```tsx
export async function generateMetadata({ params }: Props) {
  const locale = await getLocale();
  const product = await getProduct(params.slug, locale);

  return {
    title: product.productName,
    description: product.productDescription,
  };
}
```

---

## Best Practices

1. **Always provide a fallback** — If a translation is missing, show the default locale (en-IN) content rather than nothing.

2. **Translate at the data layer, not the view layer** — Resolve translations in server actions/API routes so components receive ready-to-render strings.

3. **Use the `getLocalizedField` utility consistently** — Centralize locale resolution logic to avoid inconsistencies.

4. **Keep non-translatable data flat** — Only wrap fields that actually need translation in the locale-keyed object structure.

5. **Cache translations** — For frequently accessed content (categories, navigation data), consider caching translated results.

6. **Validate translations in the CRM** — Ensure required locales have translations before publishing content.

7. **Handle RTL layouts for Arabic** — When `ar` locale is active, ensure the page direction is set:
   ```tsx
   // Already handled in the locale layout:
   <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
   ```

8. **Migration strategy** — For existing data, keep backward compatibility:
   ```typescript
   // getLocalizedField handles both old (string) and new (object) formats
   const name = getLocalizedField(product.productName, locale);
   // Works whether productName is "Jute Rug" or { "en-IN": "Jute Rug", ... }
   ```

9. **Batch translate on deployment** — When adding a new locale, run a migration script to auto-translate existing content, then have translators review.

10. **Image alt text** — Don't forget to localize image `alt` attributes for accessibility and SEO.
