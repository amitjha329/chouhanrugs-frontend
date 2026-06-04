import Image from '@/ui/components/OptimizedImage'
import defaultCraftImage from '../../../../static_assets/about_some_more_1.webp'
import { ProductCraftSection } from '@/types/SiteDataModel'

const defaultSection: Required<ProductCraftSection> = {
    enabled: true,
    eyebrow: 'The craft behind every piece',
    title: 'Made by hand, finished for modern homes',
    subtitle: 'Every Chouhan Rugs piece carries the quiet character of handmade textile work: patient weaving, natural material choices, and small variations that make each rug feel personal.',
    body: 'Our product pages show the measurements and material details, but the value of a handmade rug also comes from the process. Fibres are prepared, colors are matched, textures are built by skilled hands, and every finished piece is checked before it reaches your home.',
    image: '',
    imageAlt: 'Artisan craft process at Chouhan Rugs',
    stats: [
        { value: 'Handmade', label: 'Craft-led production' },
        { value: 'Natural', label: 'Material-focused textures' },
        { value: 'Checked', label: 'Finished before dispatch' },
    ],
    steps: [
        {
            title: 'Material selection',
            description: 'Fibres are chosen for texture, durability, and the way they sit in real living spaces.',
        },
        {
            title: 'Artisan making',
            description: 'Skilled makers build the surface by hand, giving the rug its depth, touch, and natural variation.',
        },
        {
            title: 'Finishing and care',
            description: 'Each piece is inspected, finished, and prepared so it arrives ready to style.',
        },
    ],
    highlights: [
        'Handmade rugs may carry small color, size, and texture variations.',
        'These details are normal signs of human craft, not defects.',
        'Rotate and vacuum gently to preserve the surface over time.',
    ],
}

const normalizeSection = (section?: ProductCraftSection): Required<ProductCraftSection> => ({
    ...defaultSection,
    ...section,
    stats: section?.stats?.filter(item => item.value && item.label) ?? defaultSection.stats,
    steps: section?.steps?.filter(item => item.title && item.description) ?? defaultSection.steps,
    highlights: section?.highlights?.filter(Boolean) ?? defaultSection.highlights,
})

const ProductCraftStorySection = ({ section }: { section?: ProductCraftSection }) => {
    const content = normalizeSection(section)

    if (content.enabled === false) {
        return null
    }

    const hasCustomImage = Boolean(content.image)

    return (
        <section className="border-t border-neutral-200 bg-white" aria-labelledby="product-craft-title">
            <div className="fluid_container ~px-4/0 ~py-8/12">
                <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
                    <div className="relative overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                            src={hasCustomImage ? content.image : defaultCraftImage}
                            alt={content.imageAlt}
                            width={900}
                            height={700}
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="h-full max-h-[520px] min-h-[280px] w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-white">
                            <p className="text-[12px] font-medium leading-5">Craft, material, and finish in one story</p>
                        </div>
                    </div>

                    <div className="lg:pt-1">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{content.eyebrow}</p>
                        <h2 id="product-craft-title" className="max-w-3xl text-xl font-semibold leading-snug text-neutral-950 md:text-2xl">
                            {content.title}
                        </h2>
                        <div className="mt-3 h-px w-20 bg-primary/40" aria-hidden="true" />
                        <p className="mt-4 max-w-3xl text-[13px] leading-5 text-neutral-700">{content.subtitle}</p>
                        <p className="mt-3 max-w-3xl text-[13px] leading-5 text-neutral-600">{content.body}</p>

                        <dl className="mt-5 grid gap-x-6 gap-y-3 border-y border-neutral-200 py-4 sm:grid-cols-3">
                            {content.stats.map((stat, index) => (
                                <div key={`${stat.value}-${index}`}>
                                    <dt className="text-sm font-semibold leading-5 text-neutral-950">{stat.value}</dt>
                                    <dd className="mt-0.5 text-[12px] leading-5 text-neutral-600">{stat.label}</dd>
                                </div>
                            ))}
                        </dl>

                        <ol className="mt-5 grid gap-4 md:grid-cols-3 pl-2 md:pl-0">
                            {content.steps.map((step, index) => (
                                <li key={`${step.title}-${index}`} className="relative border-l border-neutral-200 pl-4">
                                    <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-white text-[11px] font-semibold text-primary" aria-hidden="true">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-[13px] font-semibold leading-5 text-neutral-950">{step.title}</h3>
                                    <p className="mt-1.5 text-[12px] leading-5 text-neutral-600">{step.description}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-5 border-t border-neutral-200 pt-4">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-800">What to expect from handmade rugs</h3>
                            <ul className="mt-3 grid gap-2 text-[12px] leading-5 text-neutral-700 md:grid-cols-3">
                                {content.highlights.map((highlight, index) => (
                                    <li key={`${highlight}-${index}`} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductCraftStorySection
