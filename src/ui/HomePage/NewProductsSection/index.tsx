import React from 'react'
import { ProductList } from './ProductList'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { FiArrowRight } from 'react-icons/fi'

const NewProductsSection = async () => {
  const t = await getTranslations('homepage')
  const tCommon = await getTranslations('common')

  return (
    <section className="bg-[#fbfaf7] py-8 sm:py-10 lg:py-12">
      <div className="fluid_container mx-auto ~px-4/0">
        <div className="mb-4 flex flex-col gap-3 border-b border-primary/10 pb-4 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/75">
              Newly added
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-base-content sm:text-3xl">
              {t('newProductsTitle')}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-base-content/65">
              Fresh handcrafted pieces selected for everyday rooms, easy styling, and quick discovery.
            </p>
          </div>

          <Link
            href="/products?sort=new"
            prefetch={false}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {tCommon('viewAll')}
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ProductList />
      </div>
    </section>
  )
}

export default NewProductsSection
