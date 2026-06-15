// @ts-nocheck
import getSiteData from '@/backend/serverActions/getSiteData'
import React from 'react'
import { getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import type { Metadata } from 'next'
import Image from '@/ui/components/OptimizedImage'
import bannerImage from '../../signin/banner.webp'
import accentRugImage from '@/ui/HomePage/NewProductsSection/new-arrivals.webp'
import { FaWhatsapp } from 'react-icons/fa6'
import { FiArrowRight, FiClock, FiEdit3, FiMail, FiMapPin, FiMessageSquare, FiPhoneCall, FiSend, FiShield, FiUser } from 'react-icons/fi'
import getPageData from '@/backend/serverActions/getPageData'
import FAQSection from '@/ui/FAQSection'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: loc } = await props.params
    return getStaticPageMetadata({
        pageKey: "contact us",
        locale: loc as Locale,
        path: "contact-us",
        fallbackTitle: "Contact Chouhan Rugs | Handmade Rug Supplier",
        fallbackDescription: "Contact Chouhan Rugs for handmade rugs, custom orders, wholesale enquiries, and customer support.",
    })
}

const splitContactValues = (value: string = '') => value.split(',').map((item) => item.trim()).filter(Boolean)

const buildPhoneHref = (value: string = '') => {
    const normalized = value.replace(/[^\d+]/g, '')
    return normalized ? `tel:${normalized}` : '#'
}

const buildWhatsAppHref = (value: string = '') => {
    const normalized = value.replace(/\D/g, '')
    return normalized ? `https://wa.me/${normalized}` : '#'
}

const joinAddressLine = (...values: (string | undefined)[]) => values.map((value) => value?.trim()).filter(Boolean).join(', ')

const ContactCard = ({ href, icon: Icon, title, description, value, external = false, compact = false }: {
    href: string,
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    description: string,
    value?: string,
    external?: boolean,
    compact?: boolean,
}) => {
    const cardClassName = compact
        ? 'flex min-h-[150px] flex-col items-center justify-center gap-2.5 px-2.5 py-4 text-center transition-colors hover:bg-[#fcf6ef] sm:min-h-[188px] sm:gap-3 sm:px-3 sm:py-5'
        : 'flex h-full flex-col justify-between gap-4 px-5 py-6 transition-colors hover:bg-[#fcf6ef] xl:px-7'

    return (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={cardClassName}>
            <span className={`flex items-center justify-center rounded-full bg-[#f5ede3] text-[#93683f] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${compact ? 'h-11 w-11 sm:h-14 sm:w-14' : 'h-14 w-14'}`}>
                <Icon className={compact ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-6 w-6'} />
            </span>
            <div className={compact ? 'space-y-2' : 'space-y-2 text-left'}>
                <p className={`font-semibold tracking-[-0.02em] text-[#2f2015] ${compact ? 'text-[1.05rem] leading-5 sm:text-xl sm:leading-7' : 'text-xl'}`}>{title}</p>
                <p className={`text-[#7a6759] ${compact ? 'text-[12px] leading-5 sm:text-sm sm:leading-6' : 'text-sm leading-6'}`}>{description}</p>
                {value && <p className={`font-medium text-[#7a4a1d] ${compact ? 'text-[12px] leading-5 sm:text-sm' : 'text-sm'}`}>{value}</p>}
            </div>
            {compact && <FiArrowRight className="h-4 w-4 text-[#7a4a1d] sm:h-5 sm:w-5" />}
        </a>
    )
}

const FieldShell = ({ icon: Icon, textarea = false, children }: {
    icon: React.ComponentType<{ className?: string }>,
    textarea?: boolean,
    children: React.ReactNode,
}) => (
    <label className={`flex gap-2.5 rounded-[16px] border border-[#eadfd6] bg-[#fffdfa] px-3.5 py-3 text-[#6f5c4e] transition focus-within:border-[#9a6a3a] focus-within:ring-2 focus-within:ring-[#9a6a3a]/10 sm:gap-3 sm:rounded-[18px] sm:px-4 ${textarea ? 'items-start' : 'items-center'}`}>
        <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#a67a52] sm:h-5 sm:w-5" />
        {children}
    </label>
)

const DetailRow = ({ icon: Icon, title, children }: {
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    children: React.ReactNode,
}) => (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4 sm:py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5ede3] text-[#93683f] sm:h-12 sm:w-12">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 space-y-1.5">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#2f2015] sm:text-xl">{title}</h3>
            <div className="space-y-1 text-[13px] leading-5 text-[#6f5c4e] sm:text-sm sm:leading-6">{children}</div>
        </div>
    </div>
)

const ContactUsPage = async (props: { params: Promise<{ locale: string }> }) => {
    const params = await props.params
    const locale = params.locale as Locale
    const pageData = await getPageData("contact us").catch(() => null)
    const siteInfo = await getSiteData()
    const t = await getTranslations('contact')
    const text = (key: string, fallback: string) => {
        if (typeof t.has === 'function' && t.has(key as never)) {
            return t(key as never)
        }

        try {
            const value = t(key as never)
            return value === key || value === `contact.${key}` ? fallback : value
        } catch {
            return fallback
        }
    }

    const copy = {
        title: text('title', 'Contact Us'),
        subtitle: text('subtitle', "We'd love to hear from you. Reach out to us for any queries, custom orders or partnership opportunities."),
        description: text('description', 'Have doubts or questions, or want to leave a remark? Leave us a message.'),
        emailUs: text('emailUs', 'Email Us'),
        replyWithin: text('replyWithin', 'We reply within 24 hours'),
        whatsApp: text('whatsApp', 'WhatsApp'),
        chatInstantly: text('chatInstantly', 'Chat with us instantly'),
        callUs: text('callUs', 'Call Us'),
        callAvailability: text('callAvailability', 'Mon - Sat: 9:30 AM - 6:30 PM'),
        ourOffice: text('ourOffice', 'Our Office'),
        sendMessageTitle: text('sendMessageTitle', 'Send us a Message'),
        sendMessage: text('sendMessage', 'Send Message'),
        fullNamePlaceholder: text('fullNamePlaceholder', 'Full Name *'),
        emailAddressPlaceholder: text('emailAddressPlaceholder', 'Email Address *'),
        phoneNumberPlaceholder: text('phoneNumberPlaceholder', 'Phone Number (Optional)'),
        subjectPlaceholder: text('subjectPlaceholder', 'Subject'),
        messagePlaceholder: text('messagePlaceholder', 'How can we help you?'),
        privacyNote: text('privacyNote', 'We respect your privacy. Your information is safe with us.'),
        otherWays: text('otherWays', 'Other ways to reach us'),
        officeIntro: text('officeIntro', 'Visit our location or write to us for custom orders, partnerships and export enquiries.'),
        workingHours: text('workingHours', 'Working Hours'),
        workWeek: text('workWeek', 'Mon - Sat: 9:30 AM - 6:30 PM'),
        sundayClosed: text('sundayClosed', 'Sunday: Closed'),
        businessInquiries: text('businessInquiries', 'Business Inquiries'),
        businessNote: text('businessNote', 'For bulk orders, partnerships or export enquiries, write to us at'),
        findUsHere: text('findUsHere', 'Find Us Here'),
        viewOnMap: text('viewOnMap', 'View our location on the map'),
        getDirections: text('getDirections', 'Get Directions'),
        stillHaveQuestions: text('stillHaveQuestions', 'Still have questions?'),
        stillHaveQuestionsSubtitle: text('stillHaveQuestionsSubtitle', 'Need help with a custom order, wholesale request or shipping question?'),
        contactSupport: text('contactSupport', 'Contact Support'),
    }
    const emailAddress = siteInfo.contact_details.email?.trim() ?? ''
    const phoneNumber = splitContactValues(siteInfo.contact_details.phone)[0] ?? ''
    const whatsappNumber = splitContactValues(siteInfo.contact_details.whatsapp)[0] ?? phoneNumber
    const addressLineOne = joinAddressLine(siteInfo.contact_details.flat_house, siteInfo.contact_details.address1)
    const addressLineTwo = joinAddressLine(siteInfo.contact_details.address2, siteInfo.contact_details.state, siteInfo.contact_details.country)
    const postalCode = siteInfo.contact_details.PIN?.trim()
    const fullAddress = [addressLineOne, addressLineTwo, postalCode].filter(Boolean).join(', ')
    const mapQuery = encodeURIComponent(fullAddress)
    const directionsHref = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}` : '#'
    const mapEmbedSrc = fullAddress ? `https://www.google.com/maps?q=${mapQuery}&output=embed` : ''

    const mobileCards = [
        {
            href: `mailto:${emailAddress}`,
            icon: FiMail,
            title: copy.emailUs,
            description: copy.replyWithin,
            value: undefined,
            external: false,
        },
        {
            href: buildPhoneHref(phoneNumber),
            icon: FiPhoneCall,
            title: copy.callUs,
            description: copy.callAvailability,
            value: undefined,
            external: false,
        },
        {
            href: buildWhatsAppHref(whatsappNumber),
            icon: FaWhatsapp,
            title: copy.whatsApp,
            description: copy.chatInstantly,
            value: undefined,
            external: true,
        },
    ]

    const desktopCards = [
        {
            href: `mailto:${emailAddress}`,
            icon: FiMail,
            title: copy.emailUs,
            description: copy.replyWithin,
            value: emailAddress,
            external: false,
        },
        {
            href: buildWhatsAppHref(whatsappNumber),
            icon: FaWhatsapp,
            title: copy.whatsApp,
            description: copy.chatInstantly,
            value: whatsappNumber,
            external: true,
        },
        {
            href: buildPhoneHref(phoneNumber),
            icon: FiPhoneCall,
            title: copy.callUs,
            description: copy.callAvailability,
            value: phoneNumber,
            external: false,
        },
        {
            href: directionsHref,
            icon: FiMapPin,
            title: copy.ourOffice,
            description: addressLineOne,
            value: [addressLineTwo, postalCode].filter(Boolean).join(', '),
            external: true,
        },
    ]

    return (
        <div className="bg-[#fbf7f2] text-[#2f2015]">
            <section className="relative overflow-hidden border-b border-[#eee3d8] bg-[linear-gradient(180deg,#fffaf4_0%,#f8f1e8_100%)]">
                <div className="absolute left-0 top-16 h-40 w-40 rounded-full bg-[#f4e6d7]/80 blur-3xl sm:h-56 sm:w-56" />
                <div className="absolute right-0 top-10 h-52 w-52 rounded-full bg-[#ead7c2]/70 blur-3xl sm:h-72 sm:w-72" />
                <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-14">
                    <div className="relative overflow-hidden rounded-[26px] border border-[#eadfd6] bg-[linear-gradient(180deg,rgba(255,250,244,0.96)_0%,rgba(247,239,230,0.94)_100%)] px-4 py-8 shadow-[0_26px_60px_rgba(79,52,28,0.08)] sm:rounded-[32px] sm:px-8 sm:py-12 lg:px-14 lg:py-16">
                        <div className="absolute inset-y-0 left-0 hidden w-40 lg:block">
                            <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-[#efe0d0] blur-2xl" />
                            <div className="absolute left-8 top-16 h-40 w-[2px] bg-[#dfc8b3]" />
                            <div className="absolute left-0 top-10 h-52 w-28 rounded-r-full bg-[linear-gradient(180deg,rgba(241,228,212,0.9),rgba(248,241,232,0.1))]" />
                        </div>
                        <div className="absolute bottom-0 right-0 hidden h-[220px] w-[240px] overflow-hidden rounded-tl-[48px] border-l border-t border-[#eadfd6] bg-[#f7ede2] lg:block">
                            <Image src={accentRugImage} alt={copy.ourOffice} fill sizes="240px" className="object-cover object-center opacity-90" />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,237,226,0.08),rgba(247,237,226,0.82))]" />
                        </div>
                        <div className="relative mx-auto max-w-3xl text-center">
                            <h1 className="font-serif text-[2.45rem] leading-none tracking-[-0.04em] text-[#2e2016] sm:text-[3rem]">{copy.title}</h1>
                            <div className="mx-auto mt-3 flex items-center justify-center gap-2 text-[#d3b69e] sm:mt-4">
                                <span className="h-px w-8 bg-current sm:w-10" />
                                <span className="text-base sm:text-lg">∞</span>
                                <span className="h-px w-8 bg-current sm:w-10" />
                            </div>
                            <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-[#6c594b] sm:mt-4 sm:text-base sm:leading-7">{copy.subtitle}</p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-5 overflow-hidden rounded-[22px] border border-[#eadfd6] bg-white shadow-[0_18px_46px_rgba(79,52,28,0.09)] sm:mt-6 sm:rounded-[28px] lg:hidden">
                        <div className="grid grid-cols-3 divide-x divide-[#eee3d8]">
                            {mobileCards.map((card) => (
                                <ContactCard key={card.title} compact {...card} />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 -mb-8 mt-8 hidden grid-cols-4 overflow-hidden rounded-[28px] border border-[#eadfd6] bg-white shadow-[0_18px_46px_rgba(79,52,28,0.09)] lg:grid xl:-mb-14">
                        {desktopCards.map((card, index) => (
                            <div key={card.title} className={index < desktopCards.length - 1 ? 'border-r border-[#eee3d8]' : ''}>
                                <ContactCard {...card} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:pt-24">
                <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="order-2 overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white shadow-[0_18px_46px_rgba(79,52,28,0.08)] sm:rounded-[28px] lg:order-1">
                        <div className="grid h-full md:grid-cols-[0.85fr_1.15fr] lg:grid-cols-1 xl:grid-cols-[0.86fr_1.14fr]">
                            <div className="relative min-h-[210px] md:min-h-full sm:min-h-[260px]">
                                <Image src={bannerImage} alt={copy.otherWays} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,23,16,0.05),rgba(35,23,16,0.35))]" />
                            </div>
                            <div className="p-5 sm:p-7 lg:p-8">
                                <div>
                                    <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#2f2015] sm:text-[2rem]">{copy.otherWays}</h2>
                                    <p className="mt-2 text-[13px] leading-5 text-[#786556] sm:text-sm sm:leading-6">{copy.officeIntro}</p>
                                </div>

                                <div className="mt-5 divide-y divide-[#eee3d8] sm:mt-6">
                                    <DetailRow icon={FiMapPin} title={copy.ourOffice}>
                                        <p>{addressLineOne}</p>
                                        <p>{[addressLineTwo, postalCode].filter(Boolean).join(', ')}</p>
                                    </DetailRow>

                                    <DetailRow icon={FiClock} title={copy.workingHours}>
                                        <p>{copy.workWeek}</p>
                                        <p>{copy.sundayClosed}</p>
                                    </DetailRow>

                                    <DetailRow icon={FiMail} title={copy.businessInquiries}>
                                        <p>{copy.businessNote}</p>
                                        <a href={`mailto:${emailAddress}`} className="font-semibold text-[#7a4a1d] underline decoration-[#d7bda5] underline-offset-4">{emailAddress}</a>
                                    </DetailRow>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="message-form" className="order-1 rounded-[24px] border border-[#eadfd6] bg-white p-4 shadow-[0_18px_46px_rgba(79,52,28,0.08)] sm:rounded-[28px] sm:p-6 lg:order-2 lg:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#2f2015] sm:text-[2rem]">{copy.sendMessageTitle}</h2>
                                <p className="mt-2 max-w-xl text-[13px] leading-5 text-[#786556] sm:text-sm sm:leading-6">{copy.description}</p>
                            </div>
                            <div className="relative hidden h-20 w-20 overflow-hidden rounded-[22px] border border-[#efe3d6] bg-[#f7ede3] xl:block">
                                <Image src={accentRugImage} alt={copy.sendMessageTitle} fill sizes="80px" className="object-cover" />
                            </div>
                        </div>

                        <form className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                                <FieldShell icon={FiUser}>
                                    <input type="text" placeholder={copy.fullNamePlaceholder} className="w-full bg-transparent text-[13px] text-[#2f2015] outline-none placeholder:text-[#9b8878] sm:text-sm" />
                                </FieldShell>
                                <FieldShell icon={FiMail}>
                                    <input type="email" placeholder={copy.emailAddressPlaceholder} className="w-full bg-transparent text-[13px] text-[#2f2015] outline-none placeholder:text-[#9b8878] sm:text-sm" />
                                </FieldShell>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                                <FieldShell icon={FiPhoneCall}>
                                    <input type="tel" placeholder={copy.phoneNumberPlaceholder} className="w-full bg-transparent text-[13px] text-[#2f2015] outline-none placeholder:text-[#9b8878] sm:text-sm" />
                                </FieldShell>
                                <FieldShell icon={FiEdit3}>
                                    <input type="text" placeholder={copy.subjectPlaceholder} className="w-full bg-transparent text-[13px] text-[#2f2015] outline-none placeholder:text-[#9b8878] sm:text-sm" />
                                </FieldShell>
                            </div>
                            <FieldShell icon={FiMessageSquare} textarea>
                                <textarea rows={5} placeholder={copy.messagePlaceholder} className="min-h-[130px] w-full resize-none bg-transparent text-[13px] leading-5 text-[#2f2015] outline-none placeholder:text-[#9b8878] sm:min-h-[150px] sm:text-sm sm:leading-6" />
                            </FieldShell>

                            <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#7a4a1d] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(122,74,29,0.24)] transition hover:bg-[#8a5520] sm:rounded-[16px] sm:px-6 sm:py-4 sm:text-sm">
                                <span>{copy.sendMessage}</span>
                                <FiSend className="h-4 w-4" />
                            </button>
                        </form>

                        <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-medium leading-5 text-[#8f7d6d] sm:text-sm">
                            <FiShield className="h-4 w-4 shrink-0 text-[#8f7d6d]" />
                            <span>{copy.privacyNote}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white shadow-[0_18px_46px_rgba(79,52,28,0.08)] sm:rounded-[30px]">
                    <div className="relative h-[280px] sm:h-[360px] lg:h-[410px]">
                        {mapEmbedSrc ? (
                            <iframe title={copy.findUsHere} src={mapEmbedSrc} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,#f8f1e8,#efe2d3)] text-[#6f5c4e]">{copy.viewOnMap}</div>
                        )}
                        <div className="absolute left-3 top-3 max-w-[220px] rounded-[20px] border border-[#eadfd6] bg-white/95 p-4 shadow-[0_14px_28px_rgba(79,52,28,0.12)] backdrop-blur sm:left-6 sm:top-6 sm:max-w-[280px] sm:rounded-[24px] sm:p-6">
                            <p className="text-lg font-semibold tracking-[-0.03em] text-[#2f2015] sm:text-xl">{copy.findUsHere}</p>
                            <p className="mt-1 text-[13px] leading-5 text-[#786556] sm:text-sm sm:leading-6">{copy.viewOnMap}</p>
                            <a href={directionsHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-[12px] bg-[#7a4a1d] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(122,74,29,0.24)] transition hover:bg-[#8a5520] sm:mt-5 sm:rounded-[14px] sm:px-4 sm:py-3 sm:text-sm">
                                <span>{copy.getDirections}</span>
                                <FiArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1400px] px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
                <div className="relative overflow-hidden rounded-[24px] border border-[#eadfd6] bg-[linear-gradient(180deg,#f8f1e8_0%,#f6eee4_100%)] px-5 py-6 shadow-[0_18px_46px_rgba(79,52,28,0.06)] sm:rounded-[28px] sm:px-8 sm:py-8 lg:flex lg:items-center lg:justify-between lg:px-10">
                    <div>
                        <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#2f2015] sm:text-[2rem]">{copy.stillHaveQuestions}</h2>
                        <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#786556] sm:text-sm sm:leading-6">{copy.stillHaveQuestionsSubtitle}</p>
                    </div>
                    <a href={`mailto:${emailAddress}`} className="mt-4 inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#d8c1ab] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#5f3918] shadow-[0_10px_20px_rgba(79,52,28,0.08)] transition hover:border-[#c3a287] hover:text-[#7a4a1d] sm:mt-5 sm:rounded-[16px] sm:px-5 sm:py-3 sm:text-sm lg:mt-0">
                        <span>{copy.contactSupport}</span>
                        <FiArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </section>
            <FAQSection faqs={pageData?.faqs} locale={locale} />
        </div>
    )
}

export default ContactUsPage
