import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import getSiteData from '@/lib/actions/getSiteData'
import { Metadata } from 'next'
import getPageData from '@/lib/actions/getPageData'
import image_1 from "./images/cotton-rugs.webp"
import image_2 from "./images/jaipur-cotton-rugs.webp"
import image_3 from "./images/branded-cotton-rugs.webp"
import image_4 from "./images/hand-made-cotton-rugs.webp"
import image_5 from "./images/buy-best-cotton-rugs.webp"
import image_6 from "./images/cotton-rug-seller-india.webp"

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const pageMeta = await getPageData("cotton-rugs")
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
            canonical: `${dataAdditional.url}cotton-rugs`
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
                                Cotton Rugs
                            </h1>
                        </Link>
                        <div className="mt-6 text-lg leading-8 text-gray-600">
                            The process of <Link href="/cotton-rugs"><h2 className='inline'>hand crafting cotton rugs</h2></Link> at Chouhan Rugs begins with the careful selection of high-quality cotton fibers. Chouhan Rugs takes immense pride in using only the finest cotton, renowned for its softness, durability, and natural charm. As an environmentally conscious choice, cotton aligns with the values of customers who prioritize sustainability. To ensure the cotton meets the strictest standards for quality and purity, it is meticulously sourced. By procuring top-tier cotton directly from the mills, Chouhan Rugs guarantees the highest level of quality.
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/products/category/Cotton%20Rugs" className="text-sm border hover:border-primary border-gray-400 font-semibold leading-6 text-gray-900 p-5">
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
                                <p className="text-base font-semibold leading-7 text-primary">Process Of</p>
                                <Link href="/cotton-rugs"><h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cotton Rugs Creation and Design</h2></Link>
                                <p>
                                    Cotton is a plant-based fiber that is harvested from the bolls or capsules that enclose the seeds of the Gossypium genus. These plants are members of the Malvaceae family, which also contains other flowering plants such as hibiscus and okra. The main component of cotton is cellulose, a polysaccharide that constitutes the primary structural element of plant cells. Cotton has a long history of cultivation in various regions of the world, and is used to produce textiles that are soft, breathable, and durable.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-ml-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_1}
                            alt="cotton rugs"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Inspiration for Design:</strong> Every cotton rug narrates a unique story, and it&apos;s during the design process that this narrative unfolds. Inspirations for these rugs can come from a variety of sources, including traditional motifs, cultural symbols, and contemporary art. Our dedicated team meticulously crafts each rug&apos;s pattern, color scheme, and dimensions to align with our brand&apos;s aesthetic and purpose. Feedback and engagement from customers also play a crucial role in shaping the design process, ensuring that each rug caters to the diverse needs of homeowners. Some Exmples being <Link href="/cotton-rugs"><h2 className='inline'>Braided Cotton Rugs</h2></Link>, Round Cotton Rugs, Cotton Rugs/Runner etc.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Handcrafted Excellence:</strong> We hold a strong belief in keeping traditional handcrafting skills alive. The process of weaving cotton carpets is one that requires a significant amount of time, as well as a combination of talent, accuracy, and patience. The heart of this craft lies in the hands of skilled artisans who often have accumulated years of expertise in the art of weaving.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Quality Control:</strong> We are committed to the production of rugs that meet the highest standards of quality. To ensure exceptional craftsmanship, we have implemented rigorous quality control measures at every stage of the manufacturing process. Each rug undergoes thorough testing for color uniformity, texture, and overall quality before it is deemed ready for sale.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Responsibility and Sustainability:</strong> We are steadfast in our commitment to sustainability and ethical sourcing practices. The use of natural cotton fibers and traditional weaving techniques minimizes our environmental footprint. Additionally, we are deeply invested in supporting local communities by providing employment opportunities to skilled artisans, thereby preserving the rich heritage of handloom weaving.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            We stand as a testament to the timeless elegance and craftsmanship of cotton carpets. Each rug we produce is a work of art, designed to enhance any living space. From the careful selection of premium cotton to the intricate weaving process, every step is carried out with utmost precision. Our commitment to sustainability, ethical practices, and preservation of traditional craftsmanship ensures that each rug is more than just a floor covering - it&apos;s a cherished piece of home decor designed to last a lifetime. When you <Link href="/cotton-rugs"><h3 className='inline'>buy best cotton carpet</h3></Link> and welcome it into your home, you are embracing a piece of artistry and culture
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
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Manufacturing of Cotton Rugs</h1>
                                {/* <div>
                                    As a jute rug manufacturing company and <Link href="/cotton-rugs"><h2 className='inline font-semibold'>Popular Jute Rugs Seller</h2></Link>, we use various types of machinery to carry out different operations involved in the production process. Here are some of the key machines we use:
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="sm:-mr-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_2}
                            alt="premiuim quality cotton rugs"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl text-end lg:gap-x-8 lg:px-8">
                        <div className="lg:pl-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Cotton Preparation:</strong> The cotton fibers selected for our rugs undergo a meticulous cleaning, carding, and spinning process to transform them into yarn. This rigorous procedure ensures the uniformity and durability of the yarn, which are critical attributes for the creation of a resilient rug. The end result is a high-quality yarn that not only contributes to the longevity of the rug but also enhances its aesthetic appeal. This intricate process is a testament to our commitment to excellence and attention to detail in every aspect of our rug production.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Loom Setup:</strong> Our team of skilled artisans meticulously set up traditional wooden looms, adjusting them to match the specific dimensions of each rug. This step is of paramount importance as it directly influences the final size and shape of the product. The looms are carefully calibrated to ensure precision in the weaving process, thereby guaranteeing that each rug meets our exacting standards for size and form. This attention to detail during the setup phase lays the foundation for the creation of a rug that is not only aesthetically pleasing but also perfectly proportioned.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Weaving:</strong> The weaving process involves the intricate task of intertwining cotton threads to form the rug&apos;s design. This complex stage requires not only technical expertise but also a discerning eye for detail. The weavers must carefully manipulate the threads on the loom, creating a harmonious interplay of colors and patterns that bring the design to life. Each movement of the weaver&apos;s hands, each thread that is added, contributes to the overall beauty and uniqueness of the rug. This process is a testament to the weaver&apos;s skill and artistry, transforming simple cotton threads into a stunning piece of decor for our clinet to <Link href="/cotton-rugs"><h3 className='inline'>buy premium quality and branded cotton rugs online</h3></Link>.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Finishing Touches:</strong> Once the weaving process is complete, the rug undergoes a series of finishing procedures to ensure it is ready for use. These include a thorough cleaning process to remove any residual dust or debris from the weaving process. The rug is then meticulously trimmed to ensure uniformity in its texture and appearance. The edges of the rug are carefully bound to prevent fraying and enhance durability. These steps are crucial in ensuring that each rug is not only aesthetically pleasing but also meets our high standards of quality and durability. Once these finishing touches are complete, the rug is ready to be placed in its new home, where it will add warmth, comfort, and a touch of artisanal craftsmanship.
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
                            We take great pride in our standing as a premier manufacturer of high-quality cotton rugs, along with a variety of other cotton products. Our commitment to excellence and customer satisfaction has propelled us to become the top online retailer of Printed Cotton Rugs. As we continue to serve our customers, we look forward to upholding the same level of dedication and excellence that has been integral to our success.
                        </div>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/cotton-rugs"><dt className="font-medium text-gray-900">hand made cotton Rugs seller</dt></Link>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Cotton%20Rugs"><dt className="font-medium text-gray-900">handmade Round cotton rugs</dt></Link>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/cotton-rugs"><dt className="font-medium text-gray-900">branded cotton rugs</dt></Link>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Cotton%20Rugs"><dt className="font-medium text-gray-900">Jaipur cotton Rugs</dt></Link>
                            </div>
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <Image
                            src={image_3}
                            alt="branded cotton rugs"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_4}
                            alt="handmade cotton rugs"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_5}
                            alt="cotton rugs seller jaipur"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_6}
                            alt="hand crafted cotton rugs seller india"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default AboutJuteRugsPage