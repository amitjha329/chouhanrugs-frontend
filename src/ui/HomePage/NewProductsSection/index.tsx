import React from 'react'
import Image, { type StaticImageData } from 'next/image'
import { ProductList } from './ProductList'
import rugs_runners from '../../../../static_assets/1.webp'
import cushion_pillow from '../../../../static_assets/cushion.webp'
import bags from '../../../../static_assets/bags.webp'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { FiArrowRight, FiFeather, FiGrid, FiPackage } from 'react-icons/fi'

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
    className="group grid min-h-[92px] grid-cols-[1fr_82px] overflow-hidden rounded-xl border border-primary/10 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:min-h-[104px] sm:grid-cols-[1fr_98px]"
  >
    <div className="flex min-w-0 flex-col justify-between p-2.5 sm:p-3">
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-primary/70">Curated for you</p>
        <h3 className="mt-1 line-clamp-1 text-[13px] font-semibold leading-4 text-base-content sm:text-sm">{title}</h3>
        <p className="mt-1 line-clamp-2 text-[10px] leading-3.5 text-base-content/65 sm:text-[11px] sm:leading-4">{description}</p>
      </div>
      <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-primary sm:text-[11px]">
        {cta}
        <FiArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </div>
    <div className="relative bg-secondary/30">
      <Image
        src={image}
        alt={title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 82px, 98px"
        placeholder="blur"
      />
    </div>
  </Link>
)

const NewProductsSection = async () => {
  const t = await getTranslations('homepage')
  const tCommon = await getTranslations('common')

  return (
    <section className="relative overflow-hidden bg-base-100 ~py-7/12">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-secondary/30 to-transparent" aria-hidden="true" />

      <div className="fluid_container relative mx-auto ~px-4/0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end lg:gap-7">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-primary">
              <FiFeather className="h-3 w-3" aria-hidden="true" />
              Fresh from the loom
            </div>
            <h2 className="mt-2.5 font-serif text-xl leading-tight text-base-content sm:text-2xl lg:text-3xl">
              {t('newProductsTitle')} for lived-in, layered homes
            </h2>
            <p className="mt-2 max-w-lg text-xs leading-5 text-base-content/70 sm:text-sm">
              Newly added pieces with natural texture, practical sizing, and easy room-to-room styling. Browse the latest arrivals without losing sight of what fits your space.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:max-w-sm">
              {[
                { icon: FiGrid, label: 'Room ready' },
                { icon: FiFeather, label: 'Handmade' },
                { icon: FiPackage, label: 'Ship friendly' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-lg border border-primary/10 bg-base-100/80 px-2 py-2 shadow-sm">
                  <Icon className="mx-auto h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="mt-1 block text-[9px] font-semibold leading-3 text-base-content/75 sm:text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3 lg:gap-3">
            <CollectionShortcut
              href="/products/category/rugs-runners"
              image={rugs_runners}
              title={t('rugsRunners')}
              description="Slim runners and flexible rugs for halls, bedsides, and layered rooms."
              cta={tCommon('viewAll')}
            />
            <CollectionShortcut
              href="/products/category/cushion-pillow"
              image={cushion_pillow}
              title="Cushion & Pillow"
              description="Soft accents for sofas, beds, reading corners, and relaxed spaces."
              cta={tCommon('viewAll')}
            />
            <CollectionShortcut
              href="/products/category/bags"
              image={bags}
              title="Bags"
              description="Handmade carry pieces with texture, color, and everyday utility."
              cta={tCommon('viewAll')}
            />
          </div>
        </div>

        <ProductList />

        <Link
          href="/products?sort=new"
          prefetch={false}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-content shadow-sm transition hover:bg-primary/90 sm:hidden"
        >
          {tCommon('viewAll')}
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default NewProductsSection
