import Image from 'next/image'
import React from 'react'

type PromiseIconProps = {
    className?: string
}

const serifFace = {
    fontFamily: 'Georgia, "Times New Roman", serif',
}

const promises = [
    {
        title: 'Secure Payments',
        description: 'Protected transactions with trusted gateways like Razorpay and Stripe.',
        icon: ShieldLockIcon,
    },
    {
        title: 'Easy Returns',
        description: 'Hassle-free return support for eligible orders, giving you complete peace of mind.',
        icon: ReturnIcon,
    },
    {
        title: 'Free Shipping',
        description: 'Fast worldwide shipping across the US, UK, Australia, and more at no extra cost.',
        icon: TruckIcon,
    },
    {
        title: 'Safe Delivery',
        description: 'Every order is packed carefully to ensure it reaches you in perfect condition.',
        icon: SafeBoxIcon,
    },
]

function ShieldLockIcon({ className }: PromiseIconProps) {
    return (
        <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M32 8L13.5 16.2v13.9C13.5 42.7 21.1 52.6 32 57c10.9-4.4 18.5-14.3 18.5-26.9V16.2L32 8Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M23.5 31h17v14h-17V31Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M27 31v-5.5a5 5 0 0 1 10 0V31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M32 37.5V41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}

function ReturnIcon({ className }: PromiseIconProps) {
    return (
        <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M12 17h40v24H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 17v-5h26v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 28a12 12 0 1 1-12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M28 40h-9v-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function TruckIcon({ className }: PromiseIconProps) {
    return (
        <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M10 21h31v25H10V21Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M41 30h8.5l5 7.5V46H41V30Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M17 46a5 5 0 1 0 10 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M43 46a5 5 0 1 0 10 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 34h17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}

function SafeBoxIcon({ className }: PromiseIconProps) {
    return (
        <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M14 20h36v35H14V20Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M20 20v-8h24v8" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M27 20v9h10v-9" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M45 34l8 3.3v6.2c0 5.4-3.2 9.7-8 11.5-4.8-1.8-8-6.1-8-11.5v-6.2L45 34Z" fill="#f7f0e8" stroke="currentColor" strokeWidth="2.7" strokeLinejoin="round" />
            <path d="M41.5 44.5l2.6 2.7 5.1-5.8" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function PromiseCard({ title, description, icon: Icon }: typeof promises[number]) {
    return (
        <article className="card rounded-[14px] sm:rounded-[18px] border border-white/80 bg-white/75 p-3 sm:p-5 shadow-[0_12px_32px_rgba(92,72,54,0.08)] backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-6">
                <div className="flex shrink-0 flex-col items-center">
                    <div className="grid size-[52px] sm:size-[104px] place-items-center rounded-full border border-[#dfd0c2] bg-[#eee7df] text-[#986a39] shadow-inner">
                        <Icon className="size-[26px] sm:size-[54px]" />
                    </div>
                </div>
                <div className="pt-0.5">
                    <h2 className="text-[14px] sm:text-[21px] font-semibold leading-tight text-[#1d1714] sm:text-[22px]" style={serifFace}>
                        {title}
                    </h2>
                    <p className="mt-1 sm:mt-3 text-[11px] sm:text-[13px] leading-[1.4] text-[#4e5360]">
                        {description}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default function TrustSection() {
    return (
        <main className="relative isolate overflow-hidden bg-[#f7f2ec] text-[#211915]">
            <style>{`
                body > div.hidden.md\\:block,
                body > div.h-14.md\\:hidden,
                body > nav {
                    display: none !important;
                }

                button[aria-label="Open Next.js Dev Tools"] {
                    display: none !important;
                }

                nextjs-portal {
                    display: none !important;
                }
            `}</style>
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.96),transparent_34%),linear-gradient(115deg,#f8f4ee_0%,#f3ece4_45%,#efe3d6_100%)]" />
            <div className="absolute inset-0 -z-10 opacity-[0.33] [background-image:repeating-linear-gradient(96deg,rgba(108,70,36,0.035)_0,rgba(108,70,36,0.035)_1px,transparent_1px,transparent_8px)]" />
            <div className="absolute -left-24 top-0 -z-10 h-full w-[57%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.78),transparent_58%)]" />
            <div className="pointer-events-none absolute bottom-0 right-[50.55%] z-10 hidden h-[72%] w-px bg-[#d0a368] xl:block" />

            <section className="mx-auto grid w-full max-w-[1672px] grid-cols-1 items-stretch lg:grid-cols-[49.3%_50.7%]">
                <div className="relative z-20 flex flex-col justify-center px-4 py-8 sm:px-10 lg:pl-[54px] lg:pr-0 lg:py-16">
                    <Image
                        src="/test/chouhan-logo-lockup.png"
                        alt="Chouhan Rugs"
                        width={303}
                        height={58}
                        priority
                        className="h-auto w-[160px] sm:w-[200px]"
                    />

                    <div className="mt-6 sm:mt-10 max-w-[710px] lg:ml-[58px] xl:mt-[52px]">
                        <h1
                            className="max-w-[690px] text-[1.75rem] sm:text-[2.25rem] md:text-[clamp(3.25rem,4.45vw,4.75rem)] font-normal leading-[1.08] tracking-[-0.01em] text-[#201714]"
                            style={serifFace}
                        >
                            Crafted Comfort,
                            <br />
                            Delivered With Care
                        </h1>
                        <div className="mt-3 sm:mt-6 h-[4px] w-[52px] rounded-full bg-[#a76f3c]" />
                        <p className="mt-3 sm:mt-6 max-w-[675px] text-[13.5px] sm:text-[17px] lg:text-[19px] leading-[1.5] text-[#4f5360]">
                            From kitchen and living room rugs to bedroom essentials, explore our premium collection of jute rugs, kilim rugs, and cushion covers &mdash; backed by secure shopping and reliable delivery.
                        </p>
                    </div>

                    <div className="mt-6 sm:mt-8 grid w-full max-w-[726px] grid-cols-2 gap-3 sm:gap-3.5 lg:ml-[58px] xl:mt-8 xl:gap-4">
                        {promises.map((promise) => (
                            <PromiseCard key={promise.title} {...promise} />
                        ))}
                    </div>
                </div>

                <div className="relative h-[200px] sm:h-[350px] overflow-hidden lg:h-auto lg:min-h-[580px]">
                    <div className="absolute -left-[4.4%] top-[-4.5%] h-[111%] w-[114%] rounded-tl-[430px] border border-[#d9aa67]/80 hidden lg:block" />
                    <Image
                        src="/test/chouhan-delivery-visual.png"
                        alt="Chouhan Rugs delivery professional holding branded packages"
                        fill
                        priority
                        sizes="(min-width: 1024px) 51vw, 100vw"
                        className="object-cover object-center"
                    />
                </div>
            </section>
        </main>
    )
}
