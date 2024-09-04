import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import getSiteData from '@/lib/actions/getSiteData'
import { Metadata } from 'next'
import image_1 from "./images/buy-cushion-covers-online.webp"
import image_2 from "./images/jute-cushion-covers-jaipur.webp"
import image_3 from "./images/branded-cushion-covers.webp"
import image_4 from "./images/cotton-cushion-covers.webp"
import image_5 from "./images/cushion-covers-premium-quality.webp"
import image_6 from "./images/cushion-cover-online.webp"
import getPageData from '@/lib/actions/getPageData'

export async function generateMetadata(): Promise<Metadata> {
    const dataAdditional = await getSiteData()
    const pageMeta = await getPageData("pillow-and-cushion-covers")
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
            canonical: `${dataAdditional.url}pillow-and-cushion-covers`
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
                                Jute Cushion Covers and Jute Pillow Covers
                            </h1>
                        </Link>
                        <div className="mt-6 text-lg leading-8 text-gray-600">
                            Chouhan Rugs <Link href="/pillow-and-cushion-covers"><h2 className='inline'>jute pillows and cushion covers</h2></Link> are emerging as quick go-to solution for eco-conscious people in an era when sustainability and design have collided. Jute is &quot;golden fiber&quot; also known for its resilience and texture, as well as its environmentally favorable qualities.
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/products/category/Cushion%20&%20Pillow" className="text-sm border hover:border-primary border-gray-400 font-semibold leading-6 text-gray-900 p-5">
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
                                <p className="text-base font-semibold leading-7 text-primary">Path to</p>
                                <Link href="/pillow-and-cushion-covers"><h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Beautiful Cushion Covers</h2></Link>
                                <p>
                                    Jute fibers, a natural fiber obtained from the jute plant, are the principal material utilized in the creation of these coverings. Its path from farm to décor is defined by environmentally sustainable practices and various benefits
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-ml-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_1}
                            alt="jute pillow covers"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Renewable and biodegradable:</strong> Jute is an incredibly sustainable material, with a rapid growth cycle that reaches maturity in approximately 120 days. This quick turnaround makes it a highly renewable resource, ensuring a steady supply without exhausting natural resources.

                                            Moreover, products made from jute are biodegradable. This means that when these items are discarded, they naturally decompose and return to the earth, rather than persisting as environmental waste. This characteristic of jute products significantly reduces their environmental footprint and makes them a preferred choice for those seeking to minimize waste and promote sustainability. <Link href="/pillow-and-cushion-covers"><h2 className='inline'>Buy Online Jute Pillow Covers</h2></Link> with Chouhan Rugs, India.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Low Envoirmental Affect:</strong> Jute cultivation stands out as a more environmentally friendly option compared to many other crops. This is primarily due to the fact that it requires significantly less use of pesticides and fertilizers. This not only reduces the environmental impact but also contributes to sustainable farming practices. By choosing jute, we are making a conscious choice towards preserving our environment and promoting green agriculture.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Carbon Footprint Reduction:</strong> The jute plant plays a significant role in mitigating the effects of climate change. During its growth phase, the plant acts as a natural carbon sink, absorbing carbon dioxide from the atmosphere. This process helps in reducing the overall concentration of greenhouse gases, which are major contributors to global warming and climate change. By absorbing these gases, jute plants help in creating a healthier and more balanced environment. Therefore, cultivating jute and using jute products like <Link href="/pillow-and-cushion-covers"><h2 className='inline'>hand made jute cushion covers</h2></Link> not only provides us with a valuable resource but also contributes to the global efforts towards achieving environmental sustainability.
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
                                <p className="text-base font-semibold leading-7 text-primary">Some of the</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cons and Pros of Jute Pillows</h1>
                                <div>
                                    We using ancient looms, craftspeople weave jute strands into complex patterns to create the cloth for the covers. This phase demands both technical knowledge and creative sensitivity. To guarantee that each jute pillow and cushion cover achieves the highest standards of workmanship, from color consistency to overall quality, stringent quality control systems are in place.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sm:-mr-12 sm:-mt-12 sm:p-12 lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                        <Image
                            className="w-full max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] !relative max-h-[600px] object-left-bottom object-cover"
                            src={image_2}
                            alt="jute cushion covers"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl text-end lg:gap-x-8 lg:px-8">
                        <div className="lg:pl-4">
                            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                                <ul role="list" className="space-y-8 text-gray-600">
                                    <li className="flex gap-x-3">
                                        {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Eco-Friendly:</strong> Jute coverings are not only a stylish choice for your home decor, but they also come with a host of environmental benefits that make them an excellent choice for those conscious about their ecological footprint.<br />

                                            Firstly, jute coverings are biodegradable. This means that they break down naturally over time, reducing landfill waste and contributing to a healthier environment. Unlike synthetic materials that can take hundreds of years to decompose, jute returns to the earth and enriches it with organic matter.<br />
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Durability:</strong> Jute is renowned for its durability and longevity, which makes products made from it, such as jute coverings, an excellent choice for those looking for a long-term investment.

                                            The robust nature of jute stems from its inherent properties. It is a natural fiber with a golden and silky shine, often referred to as The Golden Fiber. It&apos;s the second most important vegetable fiber after cotton, in terms of usage, global consumption, production, and availability.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Texture and Comfort:</strong> Jute coverings are more than just a functional addition to your space; they bring a unique aesthetic appeal that can transform the ambiance of any room. The distinct texture of jute adds a touch of warmth and comfort to your decor, creating an inviting and cozy atmosphere that is perfect for relaxation.

                                            The natural, earthy tones of jute can complement a variety of interior design styles, from rustic to modern. Its rich texture can add depth and interest to your space, making it feel more like a <Link href="/pillow-and-cushion-covers"><h3 className='inline'>premium quality jute Cushion cover</h3></Link>. Whether you&apos;re curling up with a good book or hosting friends for a casual get-together, jute coverings can make your space feel more welcoming and comfortable.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Versatility:</strong> Jute coverings are incredibly versatile and can seamlessly blend into a variety of decor styles. Whether your aesthetic leans towards the rustic charm of a countryside cottage, the free-spirited allure of a bohemian abode, or the clean lines of a minimalistic space, jute coverings can enhance your decor with their natural beauty and texture.

                                            What makes jute coverings even more appealing is their compatibility with other jute products. For instance, jute rugs or runners can be paired with jute coverings to create a cohesive look in your space. The consistency in material and texture can add a sense of harmony to your decor, making your space feel more put-together and visually pleasing.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                                        <span>
                                            <strong className="font-semibold text-gray-900">Customization:</strong> The versatility of jute allows for a myriad of design possibilities and embellishments, ensuring that you can find the perfect covering to complement your home decor. Our online store offers a diverse range of products, allowing you to choose items that align with your personal style and preferences. We take pride in providing everyone with the opportunity to purchase a variety of products tailored to their tastes, right from the comfort of their own homes.
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
                            Chouhan rugs&apos; jute pillow and cushion coverings transcend the realm of mere home décor. They embody a commitment to environmental stewardship and artistic craftsmanship. Choosing our jute covers means not only enhancing your home with stylish comfort but also contributing to a more sustainable future. Embrace the charm of jute and elevate your living space with eco-friendly elegance that is as beneficial to your home as it is to the environment.
                        </div>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Cushion%20&%20Pillow"><dt className="font-medium text-gray-900">Best jute pillows</dt></Link>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <Link href="/products/category/Cushion%20&%20Pillow"><dt className="font-medium text-gray-900">Premium Jute Cushion Covers</dt></Link>
                            </div>
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <Image
                            src={image_3}
                            alt="natural jute pillow covers"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_4}
                            alt="handmade jute cushion covers"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_5}
                            alt="handcrafted jute pillow covers"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                        <Image
                            src={image_6}
                            alt="colorful jute cushion covers"
                            className="rounded-lg bg-gray-100 hover:scale-105 transition-all"
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default AboutJuteRugsPage