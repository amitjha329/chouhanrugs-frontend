import React from 'react'
import Image, { type StaticImageData } from 'next/image'
import { ProductList } from './ProductList'
import rugs_runners from '../../../../static_assets/1.webp'
import cushion_pillow from '../../../../static_assets/cushion.webp'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { FiArrowRight } from 'react-icons/fi'

type CollectionShortcutProps = {
  href: string
  image: StaticImageData
  title: string
  description: string
  cta: string
}

const CollectionShortcut = ({ href, image, title, description, cta }: CollectionShortcutProps) => (
  <Link
    href={href}
    prefetch={false}
    className="group grid min-h-[132px] grid-cols-[1fr_112px] overflow-hidden rounded-2xl border border-[#eadfd6] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-[1fr_150px] lg:min-h-[160px]"
  >
    <div className="flex flex-col justify-between p-4 sm:p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a623f]">New arrival edit</p>
        <h3 className="mt-2 text-base font-semibold leading-5 text-[#2d1b10] sm:text-lg">{title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#76675e] sm:text-sm">{description}</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#5b2f12]">
        {cta}
        <FiArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </div>
    <div className="relative bg-[#f5ece4]">
      <Image
        src={image}
        alt={title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 112px, 150px"
        placeholder="blur"
      />
    </div>
  </Link>
)

const NewProductsSection = async () => {
  const t = await getTranslations('homepage')
  const tCommon = await getTranslations('common')

  return (
    <section className="bg-[#fbfaf7] ~py-8/16">
      <div className="fluid_container mx-auto ~px-4/0">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a623f]">Fresh from the loom</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-[#28180f] sm:text-3xl lg:text-4xl">
              {t('newProductsTitle')}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f625a]">
              Explore recently added handloom rugs and decor, selected for easy browsing across rooms, sizes, and everyday use.
            </p>
          </div>
          <Link
            href="/products?sort=new"
            prefetch={false}
            className="hidden shrink-0 items-center gap-2 rounded-full border border-[#d7c5b6] bg-white px-4 py-2 text-sm font-semibold text-[#5b2f12] shadow-sm transition hover:border-[#5b2f12] hover:bg-[#5b2f12] hover:text-white sm:inline-flex"
          >
            {tCommon('viewAll')}
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <CollectionShortcut
            href="/products/category/rugs-runners"
            image={rugs_runners}
            title={t('rugsRunners')}
            description="Slim, practical runners for hallways, bedsides, and layered living spaces."
            cta={tCommon('viewAll')}
          />
          <CollectionShortcut
            href="/products/category/cushion-pillow"
            image={cushion_pillow}
            title="Cushion & Pillow"
            description="Soft accents that make sofas, beds, and reading corners feel complete."
            cta={tCommon('viewAll')}
          />
        </div>

        <ProductList />

        <Link
          href="/products?sort=new"
          prefetch={false}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b2f12] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3f210d] sm:hidden"
        >
          {tCommon('viewAll')}
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default NewProductsSection
