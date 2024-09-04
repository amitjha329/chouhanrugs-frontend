import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import getSiteData from '@/lib/actions/getSiteData'
import { Metadata } from 'next'
import image_1 from "./images/jute-rugs-india-chouhanrugs.webp"
import image_2 from "./images/jute-rugs-reseller-chouhanrugs.webp"
import image_3 from "./images/hand-made-jute-rugs-in-jaipur.webp"
import image_4 from "./images/killim-jute-rugs.webp"
import image_5 from "./images/round-rugs.webp"
import image_6 from "./images/rugs-seller.webp"
import getPageData from '@/lib/actions/getPageData'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const pageMeta = await getPageData("jute-rugs")
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
        alternates:{
            canonical:`${dataAdditional.url}jute-rugs`
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
                                Jute Rugs
                            </h1>
                        </Link>
                        <div className="mt-6 text-lg leading-8 text-gray-600">
                            We are Chouhan rugs a <Link href="/jute-rugs"><h2 className='inline font-semibold'>Hand Made Jute Rugs Store</h2></Link> known for our best quality jute rugs in this we will be sharing with you everything you need to know about the manufacturing of jute rugs. As a jute rug manufacturing company, we are excited to share with you the intricate process of creating our beautiful and sustainable rugs.
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/products/category/Rugs%20&%20Runners" className="text-sm border hover:border-primary border-gray-400 font-semibold leading-6 text-gray-900 p-5">
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
                                <Link href="/jute-rugs"><h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Manufacturing of jute products</h2></Link>
                                <p>
                                    Jute is a natural fibre that is extracted from the stem of the jute plant. It is a durable and strong material that has been used for centuries to create various products including rugs, bags, and clothing.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-ml-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_1}
                            alt="branded jute rugs"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Raw Material Selection:</strong> The first step in manufacturing jute rugs is selecting the raw material. At our company, we source jute fibres from reliable suppliers who provide us with high-quality raw jute. We carefully inspect the fibres to ensure they meet our quality standards before sending them to the next stage.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Cleaning and Spinning:</strong> The next stage involves cleaning the jute fibres to remove any impurities and spinning them into yarn. This process is carried out using machines that are operated by skilled staff. The machines are designed to clean and spin the fibres to produce uniform yarn that is ready for weaving.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Weaving:</strong> Once the yarn is ready, it is sent to the weaving department where skilled weavers create beautiful designs using traditional hand-looms. Our weavers have years of experience and are able to create intricate patterns and designs that give our rugs a unique and attractive look.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Dyeing:</strong> After the rugs have been woven, they are sent to the dyeing department where they are dyed using eco-friendly and non-toxic dyes. Our dyeing process is carefully monitored to ensure that the colours are consistent and do not fade over time.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Finishing:</strong> The final stage involves finishing the rugs to give them a polished and professional look. This includes trimming any loose threads, adding fringes, and applying a non-slip backing. After all the processing our customers can <Link href="/jute-rugs"><h3 className='inline font-semibold'>buy jute rugs</h3></Link> from our website.
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
                                <p className="text-base font-semibold leading-7 text-primary">Machinery Used In</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Manufacturing of jute products</h1>
                                <div>
                                    As a jute rug manufacturing company and <Link href="/jute-rugs"><h2 className='inline font-semibold'>Popular Jute Rugs Seller</h2></Link>, we use various types of machinery to carry out different operations involved in the production process. Here are some of the key machines we use:
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-mr-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_2}
                            alt="Jute Rugs"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl text-end lg:gap-x-8 lg:px-8">
                        <div className="lg:pl-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Jute Spinning Machine:</strong> This machine is used to spin the jute fibres into yarn. It is equipped with rollers and spindles that spin the fibres into uniform and strong yarn. The machine can be adjusted to produce different thicknesses of yarn.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Hand-Looms:</strong> Hand-loom is a traditional weaving machine that our weavers use to create unique and intricate patterns on our jute rugs. The loom consists of a frame, a shuttle, and a reed. The weaver uses pedals to control the movement of the shuttle, which passes the weft yarn through the warp yarn to create the desired design.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Dyeing Machine:</strong> We use a dyeing machine to dye our jute rugs with eco-friendly and non-toxic dyes. The machine is equipped with tanks that hold the dye and rollers that evenly distribute the dye onto the rugs..
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Cutting Machine:</strong> This machine is used to cut the rugs to the desired size and shape. It has a sharp blade that cuts through the fibres cleanly and precisely, ensuring that the edges are straight and neat.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Backing Machine:</strong> We use a backing machine to apply a non-slip backing to our jute rugs. The machine sprays a layer of latex on the back of the rug, which dries quickly to create a non-slip surface that helps to keep the rug in place.
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
                            We are proud of our reputation as one of the leading manufacturer of <Link href="/products/category/Rugs%20&%20Runners">premium quality jute rugs</Link>, jute baskets, <Link href="/products/category/Bags">jute bags</Link> and much more, we look forward to continuing to serve our customers with the same level of excellence and commitment that has made us successful as the best seller of <h3 className='inline font-semibold'>Printed jute Rugs online</h3>.
                        </div>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Bags"><dt className="font-medium text-gray-900">Jute Bags and Handbags</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Jute Handbags are eco-friendly as well as stylish to carry.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Cushion%20&%20Pillow"><dt className="font-medium text-gray-900">Jute Cushions and Pillows Covers</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Feel the connection to nature with Jute Cushion and Pillow Cover lineup.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Throw%20Blankets"><dt className="font-medium text-gray-900">Jute Home Furnishing & Blankets</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Soft and vibrant Blankets with lots of variation for you to choose from.</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Rugs%20&%20Runners"><dt className="font-medium text-gray-900">Jute Runners and Rug</dt></Link>
                                <dd className="mt-2 text-sm text-gray-500">Give your home a classic look with Rugs & Runners of every size and shape.</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <Image
                            src={image_3}
                            alt="Kilim Jute Rugs"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_4}
                            alt="handmade Round rugs"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_5}
                            alt="hand made Rugs seller"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_6}
                            alt="hand made jute rugs in jaipur"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default AboutJuteRugsPage