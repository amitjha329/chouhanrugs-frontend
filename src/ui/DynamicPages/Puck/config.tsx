'use client'
import type { ComponentConfig, Config } from "@measured/puck"
import Link from "next/link"
import React from "react"

export type RootProps = {
    title: string;
    metatitle: string;
    description: string;
    slug: string;
    keywords: { keyword: string }[];
    robotsIndex: boolean;
    robotsFollow: boolean;
    canonicalOverride: string;
    socialTitle: string;
    socialDescription: string;
    socialImage: string;
    primaryKeyword: string;
}

type Button = {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "ghost";
}

const richTextField = {
    type: "custom" as const,
    render({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
        return (
            <textarea
                className="textarea textarea-bordered min-h-32 w-full"
                value={value ?? ""}
                onChange={event => onChange(event.currentTarget.value)}
            />
        )
    },
}

const buttonFields = {
    label: { type: "text" as const },
    href: { type: "text" as const },
    variant: {
        type: "select" as const,
        options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
        ],
    },
}

const buttonClass = (variant: Button["variant"] = "primary") => {
    if (variant === "secondary") return "btn-secondary"
    if (variant === "ghost") return "btn-ghost border border-base-content/20"
    return "btn-primary"
}

export type HeroProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    headingTag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    align: "left" | "center";
    buttons: Button[];
}

export const Hero: ComponentConfig<HeroProps> = {
    label: "Hero",
    fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        description: richTextField,
        imageUrl: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image Alt" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: ["h1", "h2", "h3", "h4", "h5", "h6"].map(value => ({ label: value.toUpperCase(), value })),
        },
        align: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
            ],
        },
        buttons: {
            type: "array",
            min: 0,
            max: 3,
            getItemSummary: item => item.label || "Button",
            arrayFields: buttonFields,
            defaultItemProps: { label: "Shop Now", href: "/", variant: "primary" },
        },
    },
    defaultProps: {
        eyebrow: "Chouhan Rugs",
        title: "Handcrafted rugs for considered homes",
        description: "Use this section to introduce the page with a concise, editorial message.",
        imageUrl: "",
        imageAlt: "",
        headingTag: "h1",
        align: "left",
        buttons: [{ label: "Shop Now", href: "/", variant: "primary" }],
    },
    render: ({ eyebrow, title, description, imageUrl, imageAlt, headingTag, align, buttons }) => {
        const Heading = headingTag
        return (
            <section className="relative overflow-hidden bg-stone-950 text-white">
                {imageUrl && <img src={imageUrl} alt={imageAlt ?? ""} className="absolute inset-0 h-full w-full object-cover opacity-45" />}
                <div className={`relative mx-auto grid min-h-[520px] max-w-7xl content-end px-6 py-16 md:px-10 ${align === "center" ? "justify-items-center text-center" : ""}`}>
                    <div className="max-w-3xl">
                        {eyebrow && <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>}
                        <Heading className="text-4xl font-semibold leading-tight md:text-6xl">{title}</Heading>
                        {description && <div className="mt-5 max-w-2xl text-lg leading-8 text-stone-100" dangerouslySetInnerHTML={{ __html: description }} />}
                        {buttons?.length > 0 && (
                            <div className={`mt-8 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
                                {buttons.map(button => <Link key={`${button.label}-${button.href}`} href={button.href} className={`btn rounded ${buttonClass(button.variant)}`}>{button.label}</Link>)}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    },
}

export type RichTextProps = {
    title?: string;
    body: string;
    align: "left" | "center";
    maxWidth: "narrow" | "wide";
}

export const RichText: ComponentConfig<RichTextProps> = {
    label: "Rich Text",
    fields: {
        title: { type: "text" },
        body: richTextField,
        align: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
            ],
        },
        maxWidth: {
            type: "select",
            options: [
                { label: "Narrow", value: "narrow" },
                { label: "Wide", value: "wide" },
            ],
        },
    },
    defaultProps: {
        title: "Content section",
        body: "Add your content here.",
        align: "left",
        maxWidth: "narrow",
    },
    render: ({ title, body, align, maxWidth }) => (
        <section className={`mx-auto px-6 py-14 md:px-10 ${maxWidth === "wide" ? "max-w-6xl" : "max-w-4xl"}`}>
            <div className={align === "center" ? "text-center" : ""}>
                {title && <h2 className="mb-5 text-3xl font-semibold text-primary">{title}</h2>}
                <div className="prose max-w-none text-base leading-7 text-stone-700" dangerouslySetInnerHTML={{ __html: body }} />
            </div>
        </section>
    ),
}

export type ImageTextProps = {
    title: string;
    body: string;
    imageUrl?: string;
    imageAlt?: string;
    imagePosition: "left" | "right";
}

export const ImageText: ComponentConfig<ImageTextProps> = {
    label: "Image + Text",
    fields: {
        title: { type: "text" },
        body: richTextField,
        imageUrl: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image Alt" },
        imagePosition: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
            ],
        },
    },
    defaultProps: {
        title: "A section title",
        body: "Describe the collection, material, process, or offer.",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "right",
    },
    render: ({ title, body, imageUrl, imageAlt, imagePosition }) => (
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-10">
            <div className={imagePosition === "left" ? "md:order-2" : ""}>
                <h2 className="text-3xl font-semibold text-primary md:text-4xl">{title}</h2>
                <div className="mt-5 text-base leading-7 text-stone-700" dangerouslySetInnerHTML={{ __html: body }} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary/30">
                {imageUrl ? <img src={imageUrl} alt={imageAlt ?? ""} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-stone-500">Image</div>}
            </div>
        </section>
    ),
}

export type FeatureGridProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    columns: "2" | "3" | "4";
    items: { title: string; description: string }[];
}

export const FeatureGrid: ComponentConfig<FeatureGridProps> = {
    label: "Feature Grid",
    fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        description: { type: "text" },
        columns: {
            type: "select",
            options: [
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
                { label: "4 Columns", value: "4" },
            ],
        },
        items: {
            type: "array",
            min: 1,
            max: 12,
            getItemSummary: item => item.title || "Feature",
            arrayFields: {
                title: { type: "text" },
                description: { type: "text" },
            },
            defaultItemProps: { title: "Feature", description: "Describe this feature." },
        },
    },
    defaultProps: {
        eyebrow: "Why choose us",
        title: "Everything needed to choose with confidence",
        description: "Use this section for product benefits, service highlights, or page-level selling points.",
        columns: "3",
        items: [
            { title: "Handcrafted", description: "Made with care by skilled artisans." },
            { title: "Natural materials", description: "Built around jute, cotton, wool, and honest textures." },
            { title: "Export quality", description: "Designed for homes, stores, and trade buyers." },
        ],
    },
    render: ({ eyebrow, title, description, columns, items }) => (
        <section className="bg-white px-6 py-16 md:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 max-w-3xl">
                    {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
                    <h2 className="text-3xl font-semibold text-primary md:text-4xl">{title}</h2>
                    {description && <p className="mt-4 text-base leading-7 text-stone-600">{description}</p>}
                </div>
                <div className={`grid gap-5 md:grid-cols-2 ${columns === "4" ? "xl:grid-cols-4" : columns === "2" ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
                    {items.map((item, index) => (
                        <article key={index} className="rounded-lg border border-stone-200 bg-[#fbfaf8] p-6">
                            <h3 className="text-lg font-semibold text-stone-950">{item.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    ),
}

export type CtaProps = {
    title: string;
    description?: string;
    buttons: Button[];
}

export const Cta: ComponentConfig<CtaProps> = {
    label: "Call To Action",
    fields: {
        title: { type: "text" },
        description: { type: "text" },
        buttons: {
            type: "array",
            min: 0,
            max: 2,
            getItemSummary: item => item.label || "Button",
            arrayFields: buttonFields,
            defaultItemProps: { label: "Explore Collection", href: "/", variant: "secondary" },
        },
    },
    defaultProps: {
        title: "Ready to find the right rug?",
        description: "Create a focused conversion moment for buyers and trade enquiries.",
        buttons: [{ label: "Explore Collection", href: "/", variant: "secondary" }],
    },
    render: ({ title, description, buttons }) => (
        <section className="px-6 py-16 md:px-10">
            <div className="mx-auto max-w-5xl rounded-lg bg-primary px-6 py-12 text-center text-primary-content md:px-12">
                <h2 className="text-3xl font-semibold">{title}</h2>
                {description && <p className="mx-auto mt-4 max-w-2xl text-primary-content/85">{description}</p>}
                {buttons?.length > 0 && (
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        {buttons.map(button => <Link key={`${button.label}-${button.href}`} href={button.href} className={`btn rounded ${buttonClass(button.variant)}`}>{button.label}</Link>)}
                    </div>
                )}
            </div>
        </section>
    ),
}

export type FaqProps = {
    title: string;
    items: { question: string; answer: string }[];
}

export const Faq: ComponentConfig<FaqProps> = {
    label: "FAQ",
    fields: {
        title: { type: "text" },
        items: {
            type: "array",
            min: 1,
            max: 12,
            getItemSummary: item => item.question || "Question",
            arrayFields: {
                question: { type: "text" },
                answer: { type: "text" },
            },
            defaultItemProps: { question: "Question", answer: "Answer" },
        },
    },
    defaultProps: {
        title: "Frequently Asked Questions",
        items: [{ question: "What should visitors know?", answer: "Add a clear answer here." }],
    },
    render: ({ title, items }) => (
        <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
            <h2 className="mb-6 text-3xl font-semibold text-primary">{title}</h2>
            <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
                {items.map((item, index) => (
                    <details key={index} className="group p-5">
                        <summary className="cursor-pointer list-none font-semibold text-stone-950">{item.question}</summary>
                        <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    ),
}

export type PuckProps = {
    Hero: HeroProps;
    RichText: RichTextProps;
    ImageText: ImageTextProps;
    FeatureGrid: FeatureGridProps;
    Cta: CtaProps;
    Faq: FaqProps;
}

const puckConfig: Config<PuckProps, RootProps> = {
    root: {
        fields: {
            title: { type: "text", label: "Page Title" },
            metatitle: { type: "text", label: "Meta Title" },
            description: { type: "text", label: "Meta Description" },
            slug: { type: "text", label: "Page URL Slug" },
            primaryKeyword: { type: "text", label: "Primary Keyword" },
            robotsIndex: {
                type: "radio",
                label: "Robots Indexing",
                options: [
                    { label: "Index", value: true },
                    { label: "Noindex", value: false },
                ],
            },
            robotsFollow: {
                type: "radio",
                label: "Robots Link Following",
                options: [
                    { label: "Follow", value: true },
                    { label: "Nofollow", value: false },
                ],
            },
            canonicalOverride: { type: "text", label: "Canonical Override" },
            socialTitle: { type: "text", label: "Social Title" },
            socialDescription: { type: "text", label: "Social Description" },
            socialImage: { type: "text", label: "Social Image URL" },
            keywords: {
                type: "array",
                label: "Page Keywords",
                min: 0,
                max: 15,
                getItemSummary: item => item.keyword || "Keyword",
                arrayFields: { keyword: { type: "text" } },
                defaultItemProps: { keyword: "" },
            },
        },
        defaultProps: {
            title: "Untitled Page",
            metatitle: "",
            description: "",
            slug: "untitled-page",
            keywords: [],
            robotsIndex: true,
            robotsFollow: true,
            canonicalOverride: "",
            socialTitle: "",
            socialDescription: "",
            socialImage: "",
            primaryKeyword: "",
        },
    },
    categories: {
        page: {
            title: "Page Sections",
            components: ["Hero", "RichText", "ImageText", "FeatureGrid", "Cta", "Faq"],
        },
    },
    components: {
        Hero,
        RichText,
        ImageText,
        FeatureGrid,
        Cta,
        Faq,
    },
}

export default puckConfig
