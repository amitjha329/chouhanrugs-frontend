import React from 'react'
import { type Locale } from '@/i18n/routing'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type LocalizedField } from '@/lib/resolveLocalized'

export interface FaqItem {
    question: LocalizedField<string>
    answer: LocalizedField<string>
}

interface FAQSectionProps {
    faqs?: FaqItem[]
    locale: Locale
}

export default function FAQSection({ faqs = [], locale }: FAQSectionProps) {
    // Filter out items that don't have resolved question or answer for SEO safety
    const activeFaqs = faqs
        .map(faq => ({
            question: resolveLocalizedString(faq.question, locale),
            answer: resolveLocalizedString(faq.answer, locale),
        }))
        .filter(faq => faq.question.trim().length > 0 && faq.answer.trim().length > 0)

    if (activeFaqs.length === 0) return null

    // Generate FAQPage JSON-LD Structured Data
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: activeFaqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }

    // Split active FAQs into two balanced columns
    const leftColFaqs = activeFaqs.filter((_, idx) => idx % 2 === 0)
    const rightColFaqs = activeFaqs.filter((_, idx) => idx % 2 !== 0)

    return (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            {/* JSON-LD Schema Injector */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            {/* Section Header */}
            <div className="text-center mb-14 md:mb-20">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a76f3c] mb-3 block">
                    Questions & Answers
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5d3c1e] tracking-tight leading-tight">
                    Frequently Asked Questions
                </h2>
                <p className="mt-4 text-sm font-medium text-[#8b7868] max-w-md mx-auto">
                    Explore quick answers about our artisanal rugs, handloom craft, ordering, shipping, and store policies.
                </p>
            </div>

            {/* Responsive Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column */}
                <div className="space-y-4">
                    {leftColFaqs.map((faq, index) => (
                        <FaqAccordionCard 
                            key={`left-${index}`} 
                            faq={faq} 
                            uniqueId={`faq-left-${index}`} 
                        />
                    ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {rightColFaqs.map((faq, index) => (
                        <FaqAccordionCard 
                            key={`right-${index}`} 
                            faq={faq} 
                            uniqueId={`faq-right-${index}`} 
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

const FaqAccordionCard = ({ 
    faq, 
    uniqueId 
}: { 
    faq: { question: string; answer: string }; 
    uniqueId: string 
}) => {
    return (
        <div className="collapse collapse-plus bg-[#fdfbf9] border border-[#e5ccb5]/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:shadow-[#5d3c1e]/5 hover:border-[#6c4624]/40">
            <input
                type="checkbox"
                id={uniqueId}
                name="faq-accordion"
                className="peer"
            />
            <div className="collapse-title text-sm sm:text-base font-bold text-[#5d3c1e] pr-12 pl-6 py-4.5 cursor-pointer select-none leading-snug">
                {faq.question}
            </div>
            <div className="collapse-content text-[13px] sm:text-sm text-[#7a6452] leading-relaxed">
                <div className="px-6 pb-6 border-t border-[#f5ece3] pt-4">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                </div>
            </div>
        </div>
    )
}
