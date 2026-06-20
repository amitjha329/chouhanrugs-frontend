import Image from 'next/image'
import React from 'react'
import { getLocale } from 'next-intl/server'
import { getHomePageOrderProcessInformation } from '@/backend/serverActions/getHomePageOrderProcessInformation'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'

type PromiseIconProps = {
    className?: string
}

const serifFace = {
    fontFamily: 'Georgia, "Times New Roman", serif',
}

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

const iconMap: Record<string, any> = {
    'ShieldLock.svg': ShieldLockIcon,
    'EasyReturn.svg': ReturnIcon,
    'FreeShipping.svg': TruckIcon,
    'SafeDelivery.svg': SafeBoxIcon,
}

function PromiseCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
    return (
        <article className="card rounded-xl border border-white/80 bg-white/75 p-2.5 sm:p-3.5 shadow-[0_4px_16px_rgba(92,72,54,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#6c4624]/20">
            <div className="flex flex-row items-start text-left gap-2.5 sm:gap-3.5">
                <div className="flex shrink-0">
                    <div className="grid size-[34px] sm:size-[44px] lg:size-[48px] place-items-center rounded-full border border-[#dfd0c2] bg-[#eee7df] text-[#986a39] shadow-inner">
                        <Icon className="size-[16px] sm:size-[22px] lg:size-[24px]" />
                    </div>
                </div>
                <div className="pt-0.5">
                    <h2 className="text-[11px] sm:text-[13px] lg:text-[14px] font-bold leading-tight text-[#1d1714]" style={serifFace}>
                        {title}
                    </h2>
                    <p className="mt-1 text-[9.5px] sm:text-[11px] lg:text-[12px] leading-[1.3] text-[#4f5360]">
                        {description}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default async function TrustSection() {
    const [loc, data] = await Promise.all([
        getLocale(),
        getHomePageOrderProcessInformation()
    ])
    const locale = loc as Locale

    const resolvedTitle = data?.title 
        ? resolveLocalizedString(data.title, locale) 
        : 'Crafted Comfort,\nDelivered With Care'

    const stepsData = data?.steps
    const promises = stepsData
        ? [
            {
                title: resolveLocalizedString(stepsData.stepOne.title, locale) || 'Secure Payments',
                description: resolveLocalizedString(stepsData.stepOne.description, locale) || 'Protected transactions with trusted gateways.',
                icon: iconMap[stepsData.stepOne.icon] || ShieldLockIcon,
            },
            {
                title: resolveLocalizedString(stepsData.stepTwo.title, locale) || 'Easy Returns',
                description: resolveLocalizedString(stepsData.stepTwo.description, locale) || 'Hassle-free return support for eligible orders.',
                icon: iconMap[stepsData.stepTwo.icon] || ReturnIcon,
            },
            {
                title: resolveLocalizedString(stepsData.stepThree.title, locale) || 'Free Shipping',
                description: resolveLocalizedString(stepsData.stepThree.description, locale) || 'Fast worldwide shipping across the US, UK, etc.',
                icon: iconMap[stepsData.stepThree.icon] || TruckIcon,
            },
            {
                title: resolveLocalizedString(stepsData.stepFour.title, locale) || 'Safe Delivery',
                description: resolveLocalizedString(stepsData.stepFour.description, locale) || 'Every order is packed carefully to reach in perfect condition.',
                icon: iconMap[stepsData.stepFour.icon] || SafeBoxIcon,
            },
        ]
        : [
            {
                title: 'Secure Payments',
                description: 'Protected transactions with trusted gateways like Razorpay and Stripe.',
                icon: ShieldLockIcon,
            },
            {
                title: 'Easy Returns',
                description: 'Hassle-free return support for eligible orders, giving you peace of mind.',
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

    return (
        <main className="relative isolate overflow-hidden bg-[#f7f2ec] text-[#211915] rounded-3xl border border-[#e5ccb5]/30 shadow-sm max-w-[1400px] mx-auto">
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.96),transparent_34%),linear-gradient(115deg,#f8f4ee_0%,#f3ece4_45%,#efe3d6_100%)]" />
            <div className="absolute inset-0 -z-10 opacity-[0.33] [background-image:repeating-linear-gradient(96deg,rgba(108,70,36,0.035)_0,rgba(108,70,36,0.035)_1px,transparent_1px,transparent_8px)]" />
            <div className="absolute -left-24 top-0 -z-10 h-full w-[57%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.78),transparent_58%)]" />
            <div className="pointer-events-none absolute bottom-0 right-[42%] z-10 hidden h-[72%] w-px bg-[#d0a368]/60 lg:block" />

            <section className="mx-auto grid w-full grid-cols-1 items-stretch lg:grid-cols-[58%_42%]">
                {/* Left Side: Brand & Promises Content */}
                <div className="relative z-20 flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-8 lg:pl-10 lg:pr-6 lg:py-10 xl:py-11">
                    <Image
                        src="/test/chouhan-logo-lockup.png"
                        alt="Chouhan Rugs"
                        width={303}
                        height={58}
                        priority
                        className="h-auto w-[110px] sm:w-[130px]"
                    />

                    <div className="mt-4 sm:mt-6 max-w-[650px] lg:ml-2 xl:mt-8">
                        <h1
                            className="max-w-[600px] text-[1.35rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.6rem] font-normal leading-[1.15] tracking-[-0.015em] text-[#201714] whitespace-pre-line"
                            style={serifFace}
                        >
                            {resolvedTitle}
                        </h1>
                        <div className="mt-2.5 sm:mt-3 h-[3px] w-[35px] rounded-full bg-[#a76f3c]" />
                        <p className="mt-3 sm:mt-4 max-w-[550px] text-[11.5px] sm:text-[13px] lg:text-[13.5px] leading-[1.4] text-[#4f5360] font-medium">
                            From kitchen and living room rugs to bedroom essentials, explore our premium collection of jute rugs, kilim rugs, and cushion covers &mdash; backed by secure shopping and reliable delivery.
                        </p>
                    </div>

                    {/* Responsive promises grid (2 cols on all screens for compactness) */}
                    <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:ml-2 xl:mt-6">
                        {promises.map((promise, idx) => (
                            <PromiseCard key={idx} {...promise} />
                        ))}
                    </div>
                </div>

                {/* Right Side: Delivery Visual Image (Desktop Only) */}
                <div className="relative hidden lg:block overflow-hidden lg:min-h-[380px] xl:min-h-[420px]">
                    <div className="absolute -left-[4.4%] top-[-4.5%] h-[111%] w-[114%] rounded-tl-[430px] border border-[#d9aa67]/80 hidden lg:block" />
                    <Image
                        src="/test/chouhan-delivery-visual.png"
                        alt="Elegant presentation of a luxury Chouhan Rug in a sunlit modern living room"
                        fill
                        priority
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="object-cover object-center"
                    />
                </div>
            </section>
        </main>
    )
}
