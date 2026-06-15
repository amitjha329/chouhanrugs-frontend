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

    return (
        <section className="mx-auto max-w-4xl px-4 py-16">
            {/* JSON-LD Schema Injector */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                    Frequently Asked Questions
                </h2>
                <div className="mt-2 text-sm text-gray-500">
                    Got questions? We've got answers.
                </div>
            </div>

            <div className="space-y-4">
                {activeFaqs.map((faq, index) => (
                    <div
                        key={index}
                        className="collapse collapse-plus bg-[#fcfbfa] hover:bg-[#faf8f6] border border-[#eadfd6] rounded-xl transition-all duration-300"
                    >
                        <input
                            type="checkbox"
                            id={`faq-item-${index}`}
                            name="faq-accordion"
                            className="peer"
                        />
                        <div className="collapse-title text-base sm:text-lg font-semibold text-gray-800 pr-10 pl-6 py-4 cursor-pointer select-none">
                            {faq.question}
                        </div>
                        <div className="collapse-content px-6 pb-5 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-[#f3ede8] pt-4">
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
