import CategoriesDataModel from '@/types/CategoriesDataModel'
import Image from 'next/image'
import { FaLeaf } from 'react-icons/fa6'
import { FiGrid, FiShield, FiHome } from 'react-icons/fi'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import ExpandableDescription from './ExpandableDescription'

const CategorySeoBlock = async ({ category }: { category: CategoriesDataModel }) => {
    if (!category) return null

    const categoryImage = category.banner || category.imgSrc || '/chouhanrugs.png'
    const description = category.description || `Discover premium ${category.name} by Chouhan Rugs. Handcrafted, eco-friendly, durable, and stylish rugs designed to bring natural elegance to every home.`
    const features = [
        { label: 'Eco Friendly', icon: FaLeaf },
        { label: 'Handcrafted', icon: FiGrid },
        { label: 'Durable', icon: FiShield },
        { label: 'Perfect for Home', icon: FiHome },
    ]

    // Server-side device detection
    const header = await headers()
    const isMobile = getDevice({ headers: header }) === 'mobile'

    return (
        <section>
            <div className="fluid_container mx-auto px-4 lg:px-0">

                    {isMobile ? (
                        /* Mobile Hero Card - compact vertical stack for small screens */
                        <div className="flex flex-col relative overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-[0_8px_24px_rgb(0,0,0,0.025)]">

                            {/* Mobile Image */}
                            <div className="relative h-[132px] w-full overflow-hidden bg-base-200 border-b border-[#f3ede8] min-[390px]:h-[150px] sm:h-[190px]">
                                <Image
                                    src={categoryImage}
                                    alt={category.name}
                                    fill
                                    sizes="100vw"
                                    priority
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            {/* Mobile Text Content & Features */}
                            <div className="flex w-full flex-col justify-between p-4 min-[390px]:p-5 sm:p-6">
                                <div>
                                    {/* Tag */}
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-1 rounded-full bg-[#6c4624]" aria-hidden="true" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6c4624]">
                                            {category.name}
                                        </span>
                                    </div>

                                    {/* Headline */}
                                    <h1 className="mt-3 font-serif text-[1.45rem] font-bold leading-tight text-[#231814] min-[390px]:text-2xl sm:text-3xl">
                                        {category.seoTitle || category.name}
                                    </h1>

                                    {/* Description */}
                                    <ExpandableDescription
                                        text={description}
                                        className="mt-3 text-xs leading-relaxed text-[#6f6258] min-[390px]:text-[0.8125rem] sm:text-sm"
                                    />
                                </div>

                                {/* Features Row */}
                                <div className="mt-4 grid grid-cols-4 gap-1.5 border-t border-[#f3ede8] pt-4 min-[390px]:gap-2">
                                    {features.map(({ label, icon: Icon }) => (
                                        <div key={label} className="flex min-w-0 flex-col items-center text-center">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fcf9f6] border border-[#f3ede8] text-[#6c4624] min-[390px]:h-8 min-[390px]:w-8">
                                                <Icon className="h-3.5 w-3.5 min-[390px]:h-4 min-[390px]:w-4" />
                                            </div>
                                            <span className="mt-1 max-w-full text-[9px] font-semibold leading-[1.05] text-[#4f443d] min-[390px]:text-[10px]">
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Desktop Hero Card */
                        <div className="flex relative overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-[0_8px_24px_rgb(0,0,0,0.02)] lg:items-stretch max-h-[360px]">

                            {/* Left Column: Text Content & Feature Badges */}
                            <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-[100%] lg:p-9">
                                <div>
                                    {/* Category Category Name / Tag */}
                                    <div className="flex items-center gap-3">
                                        <span className="h-4 w-1.5 rounded-full bg-[#6c4624]" aria-hidden="true" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6c4624]">
                                            {category.name}
                                        </span>
                                    </div>

                                    {/* Headline (SEO Title or Name) */}
                                    <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#231814] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]">
                                        {category.seoTitle || category.name}
                                    </h1>

                                    {/* Paragraph description */}
                                    <ExpandableDescription
                                        text={description}
                                        className="mt-4 text-sm leading-relaxed text-[#6f6258]"
                                    />
                                </div>

                                {/* Features Badges Row */}
                                <div className="mt-6 grid grid-cols-4 gap-3 border-t border-[#f3ede8] pt-5 sm:gap-4">
                                    {features.map(({ label, icon: Icon }) => (
                                        <div key={label} className="flex min-w-0 flex-col items-center text-center">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fcf9f6] border border-[#f3ede8] text-[#6c4624] transition-colors hover:bg-[#6c4624]/10">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="mt-1.5 text-[11px] font-semibold leading-tight text-[#4f443d] sm:text-xs">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Your exact customized image */}
                            <Image
                                src={categoryImage}
                                alt={category.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                priority
                                className="transition-transform duration-700 hover:scale-105 !relative"
                                style={{
                                    clipPath: 'ellipse(78% 96% at 75% 90%)'
                                }}
                            />
                        </div>
                    )}
            </div>
        </section>
    )
}

export default CategorySeoBlock
