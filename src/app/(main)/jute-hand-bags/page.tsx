import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import image_1 from "./images/colorful-jute-bags.webp"
import image_2 from "./images/natural-jute-bags.webp"
import image_3 from "./images/braided-jute-bags.webp"
import image_4 from "./images/branded-jute-bags.webp"
import image_5 from "./images/premium-jute-bags.webp"
import image_6 from "./images/hand-made-jute-bags.webp"
import getSiteData from '@/backend/serverActions/getSiteData'
import getPageData from '@/backend/serverActions/getPageData'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const pageMeta = await getPageData("hand-bags")
    const title = pageMeta?.pageTitle ?? ""
    const description = pageMeta?.pageDescription ?? ""
    const keywords = pageMeta?.pageKeywords ?? ""
    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "Chouhan Rugs",
            phoneNumbers: dataAdditional.contact_details.phone,
            emails: dataAdditional.contact_details.email,
            images: image_1.src
        },
        twitter: {
            title,
            card: "summary",
            description,
            images: image_1.src,
        },
        alternates: {
            canonical: `${dataAdditional.url}jute-hand-bags`
        }
    }
}

const AboutJuteRugsPage = () => {
    return (
        <>
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#815b51] to-[#ffc98b] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <Link href="/">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Jute Hand Bags
                            </h1>
                        </Link>
                        <div className="mt-6 text-lg leading-8 text-gray-600">
                            <p>Each Chouhan jute <Link href="/jute-hand-bags"><h2 className='inline'>handcrafted natural jute bag</h2></Link> is more than just a fashion accessory; it&apos;s a unique narrative encapsulated in design. Drawing inspiration from nature, culture, and contemporary art, these bags are a testament to the beauty that surrounds us.</p>

                            <p>Our dedicated design team meticulously crafts intricate patterns, textures, and color schemes that align with the brand&apos;s ethos and vision. The result is a collection of sophisticated handcrafted bags that not only make a style statement but also resonate with the brand&apos;s commitment to artistry and quality.</p>
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/products/category/Bags" className="text-sm border hover:border-primary border-gray-400 font-semibold leading-6 text-gray-900 p-5">
                                Shop Now <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>

            <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0" id='learn-more'>
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <svg
                        className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                                width={200}
                                height={200}
                                x="50%"
                                y={-1}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M100 200V.5M.5 .5H200" fill="none" />
                            </pattern>
                        </defs>
                        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                            <path
                                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                                strokeWidth={0}
                            />
                        </svg>
                        <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
                    </svg>
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <p className="text-base font-semibold leading-7 text-primary">Path from</p>
                                <Link href="/jute-hand-bags"><h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Jute to Beautiful Hand Bags</h2></Link>
                                <p>
                                    We are committed to maintaining the skill of handcraftsmanship. We give our 100% best to made every single product unique, best in quality with colorful design. We have certain techniques and methods to made our jute handmade bags.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-ml-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_1}
                            alt="jute hand bags"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Jute Preparation:</strong> The jute fibers undergo a meticulous process of cleaning, combing, and treatment to ensure they meet the brand&apos;s stringent standards of quality and purity. This step is crucial in achieving a uniform and refined appearance in the final product. It underscores our commitment to delivering only the highest quality products to our customers.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Loom Setup:</strong> Artisans meticulously set up traditional wooden looms, tailoring them to the specific dimensions and style of each bag. This careful setup is crucial in achieving the desired size and structure of the bag, ensuring that each piece meets our high standards of quality and design.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Weaving:</strong> During the weaving process, the treated jute fibers are intricately interwoven to create the fabric for <Link href="/jute-hand-bags"><h2 className='inline'>colorful jute hand bags</h2></Link>. This delicate stage requires a blend of technical skill and aesthetic sensibility to achieve the desired patterns and textures. It&apos;s a testament to the artisan&apos;s craftsmanship, where precision and creativity come together to bring the design to life..
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Dyeing:</strong> Once the weaving process is complete, the jute bags are transferred to the dyeing department. Here, they undergo a coloring process using eco-friendly and non-toxic dyes, aligning with our commitment to sustainability. This dyeing process is closely monitored to ensure color consistency and longevity, guaranteeing that the vibrant hues of your jute bag remain unfaded over time.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Finishing:</strong> Upon completion of the weaving process, the jute bag undergoes a series of finishing touches. This includes trimming and sewing to ensure the bag&apos;s structure and durability. Additionally, handles or straps are attached, enhancing the bag&apos;s functionality and aesthetic appeal. This meticulous attention to detail ensures that each jute bag is not only robust and practical but also visually pleasing and feels like <Link href="/jute-hand-bags"><h3 className='inline'>premium Jute Bags</h3></Link>.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl text-end lg:gap-x-8 lg:px-8">
                        <div className="lg:pl-4">
                            <div className="lg:max-w-lg">
                                <p className="text-base font-semibold leading-7 text-primary">Process of</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Manufacturing a durable Jute Hand Bag</h1>
                                <div>
                                    As a jute products manufacturing company and <Link href="/jute-hand-bags"><h2 className='inline font-semibold'>Popular Jute Hand Bags Seller</h2></Link>, we use various types of machinery to carry out different operations involved in the production process. Here are some of the key things we ensure for <Link href="/products/category/Bags"><h3 className='inline'>durable and high quality jute hand bags</h3></Link>:
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-mr-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_2}
                            alt=" premium quality jute bags"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl text-end lg:gap-x-8 lg:px-8">
                        <div className="lg:pl-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            At Chouhan Rugs, we uphold stringent quality control measures at every stage of production to ensure the highest standards of craftsmanship. Each jute handmade bag undergoes a thorough inspection for consistency in color, texture, stitching, and overall quality before it is approved for sale.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            Our jute handmade bags are more than just fashion accessories; they represent a blend of elegance and environmental consciousness. The careful selection of premium jute, coupled with the intricate weaving process, results in a product that beautifully merges style and sustainability.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            When you choose a Chouhan jute handmade bag, you&apos;re not just making a fashion statement; you&apos;re consciously supporting artisanal craftsmanship, ethical sourcing, and environmental preservation. With Chouhan Rugs, you can elevate your style while minimizing your environmental impact. Each bag we offer is a testament to eco-friendly elegance.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Products</h2>
                        <div className="mt-4 text-gray-500">
                            We take immense pride in being recognized as a leading manufacturer of premium quality jute products, including rugs, baskets, bags, and more. Our commitment to excellence and customer satisfaction has positioned us as the top seller of Printed Jute Hand Bags online. As we continue on our journey, we remain dedicated to maintaining the high standards that have contributed to our success. We look forward to serving our customers with the same level of excellence that has become synonymous with our brand.
                        </div>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/jute-hand-bags"><dt className="font-medium text-gray-900">Jute Bags and Handbags</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Jute Handbags are eco-friendly as well as stylish to carry.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Bags"><dt className="font-medium text-gray-900">Natural Jute Bags</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Feel the connection to nature with Jute Hand Bags and Baskets lineup.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/jute-hand-bags"><dt className="font-medium text-gray-900">Colorful Jute Bags</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Soft and vibrant Hand Bags with lots of variation for you to choose from.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Bags"><dt className="font-medium text-gray-900">Premium Jute Bags</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Super High Quality, Premium Feel and Durable Hand Bags for Long Life.</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <Image
                            src={image_3}
                            alt="braided jute bags"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_4}
                            alt="branded jute bags"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_5}
                            alt="hand made jute bags"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_6}
                            alt="colorful jute bags in jaipur"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutJuteRugsPage