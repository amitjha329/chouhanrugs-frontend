import { safeJsonLd } from "@/lib/seoCatalog";

type FaqItem = {
    question: string;
    answer: string;
};

export function extractFaqItems(data: unknown): FaqItem[] {
    const content = (data as { content?: Array<{ type?: string; props?: { items?: FaqItem[] } }> })?.content;
    if (!Array.isArray(content)) return [];

    return content
        .filter(block => block?.type === "Faq" && Array.isArray(block.props?.items))
        .flatMap(block => block.props?.items ?? [])
        .map(item => ({
            question: String(item.question ?? "").trim(),
            answer: String(item.answer ?? "").trim(),
        }))
        .filter(item => item.question && item.answer);
}

export default function generateFaqJsonLd(items: FaqItem[]) {
    return safeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    });
}
