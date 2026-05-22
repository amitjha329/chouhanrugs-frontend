import React from 'react'
import Image from 'next/image'
import slugify from 'slugify'
import { FiArrowRight, FiAward, FiFeather, FiShield, FiTruck } from 'react-icons/fi'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'
import { getNewProducts } from '@/backend/serverActions/getNewProducts'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { ProductList } from './ProductList'

const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjZGMUYwIi8+PC9zdmc+"

const featureItems = [
  {
    icon: FiFeather,
    title: 'Handcrafted',
    description: 'Made by artisans',
  },
  {
    icon: FiAward,
    title: 'Premium',
    description: 'Natural materials',
  },
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Quick shipping',
  },
  {
    icon: FiShield,
    title: 'Secure',
    description: 'Safe checkout',
  },
]

const NewProductsSection = async () => {
  const [tCommon, localeValue, products] = await Promise.all([
    getTranslations('common'),
    getLocale(),
    getNewProducts({ limit: 10 }),
  ])

  if (products.length === 0) return null

  const locale = localeValue as Locale
  const heroProduct = products[0]
  const heroName = resolveLocalizedString(heroProduct.productTitle, locale) || resolveLocalizedString(heroProduct.productName, locale)
  const heroImage = heroProduct.images?.[heroProduct.productPrimaryImageIndex] ?? heroProduct.images?.[0]
  const heroUrl = resolveLocalizedString(heroProduct.productURL, locale)
  const heroHref = heroUrl ? `/products/${slugify(heroUrl, { lower: true, strict: true })}` : '/products?sort=new'

  return (
    <section className="bg-[#fbf7ef] py-8 md:py-14">
      <div className="fluid_container mx-auto ~px-4/0">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_44px_rgba(83,53,28,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr]">
            <Link
              href={heroHref}
              prefetch={false}
              className="relative block h-[260px] overflow-hidden sm:h-[320px] lg:h-auto lg:min-h-[460px]"
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={heroName || 'New arrivals at Chouhan Rugs'}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : null}

              <div className="absolute left-4 top-4">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.05em] text-white shadow-lg md:h-[88px] md:w-[88px] md:text-[12px]">
                  New
                  <br />
                  Arrivals
                </div>
              </div>
            </Link>

            <div className="relative overflow-hidden bg-white p-5 md:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#e8ddd3] opacity-40 blur-3xl md:h-52 md:w-52" />

              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#8d6f5b] md:text-[11px]">
                  Handcrafted Elegance
                </p>

                <h2 className="mt-2 font-serif text-2xl leading-[0.95] text-[#1f1a17] md:text-[4rem] lg:text-[4.5rem]">
                  New
                  <br />
                  Products
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-[#6f6257] md:text-[15px] md:leading-7">
                  Fresh handcrafted pieces selected for everyday rooms, easy styling and quick discovery.
                </p>

                <div className="mt-6">
                  <Link
                    href="/products?sort=new"
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#2b211c] focus:outline-none focus:ring-2 focus:ring-primary/25"
                  >
                    Explore Collection
                    <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {featureItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.title} className="rounded-xl bg-white px-3 py-3 text-center shadow-sm shadow-slate-300">
                        <span className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ece1d7] bg-[#fbf7f2] text-[#2b211c]">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <h4 className="text-[12px] font-semibold leading-4 text-[#1f1a17]">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-[10px] leading-4 text-[#7a6f66] md:text-[11px]">
                          {item.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 mt-8 flex items-end justify-between gap-4 md:mb-6 md:mt-10">
          <div>
            <h2 className="font-serif text-[32px] leading-none text-[#1f1a17] md:text-[54px]">
              Shop by New Arrivals
            </h2>
            <p className="mt-2 text-sm text-[#7b6f65] md:text-base">
              Unique designs, timeless quality.
            </p>
          </div>

          <Link
            href="/products?sort=new"
            prefetch={false}
            className="hidden items-center gap-2 rounded-full border border-[#ddd] bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-[#faf6f2] focus:outline-none focus:ring-2 focus:ring-primary/20 md:inline-flex"
          >
            {tCommon('viewAll')}
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ProductList products={products} />
      </div>
    </section>
  )
}

export default NewProductsSection
