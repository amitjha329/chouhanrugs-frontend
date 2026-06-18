'use client'
import type { ComponentConfig, Config } from "@measured/puck"
import Link from "next/link"
import React from "react"
import ProductCardItem from "@/ui/Product/ProductCardItem"
import { getCategoriesForClient, getProductsByCategoryForClient } from "@/backend/serverActions/clientCategoriesAndProducts"

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

const CategorySelectorField = {
    type: "custom" as const,
    render({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
        const [categories, setCategories] = React.useState<any[]>([])
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
            let active = true
            const load = async () => {
                try {
                    const data = await getCategoriesForClient()
                    if (active) {
                        setCategories(data)
                        setLoading(false)
                    }
                } catch (e) {
                    console.error(e)
                    if (active) setLoading(false)
                }
            }
            load()
            return () => { active = false }
        }, [])

        return (
            <select
                className="select select-bordered w-full"
                value={value ?? ""}
                onChange={event => onChange(event.currentTarget.value)}
                disabled={loading}
            >
                <option value="">Select Category...</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>
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

const headingOptions = ["h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "p", "strong"].map(value => ({ label: value.toUpperCase(), value }))

export type HeroProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    headingTag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
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
            options: headingOptions,
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
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
}

export const RichText: ComponentConfig<RichTextProps> = {
    label: "Rich Text",
    fields: {
        title: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
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
        headingTag: "h2",
        body: "Add your content here.",
        align: "left",
        maxWidth: "narrow",
    },
    render: ({ title, body, align, maxWidth, headingTag }) => {
        const Heading = headingTag || "h2";
        return (
            <section className={`mx-auto px-6 py-14 md:px-10 ${maxWidth === "wide" ? "max-w-6xl" : "max-w-4xl"}`}>
                <div className={align === "center" ? "text-center" : ""}>
                    {title && <Heading className="mb-5 text-3xl font-semibold text-primary">{title}</Heading>}
                    <div className="prose max-w-none text-base leading-7 text-stone-700" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
            </section>
        )
    },
}

export type ImageTextProps = {
    title: string;
    body: string;
    imageUrl?: string;
    imageAlt?: string;
    imagePosition: "left" | "right";
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
}

export const ImageText: ComponentConfig<ImageTextProps> = {
    label: "Image + Text",
    fields: {
        title: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
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
        headingTag: "h2",
        body: "Describe the collection, material, process, or offer.",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "right",
    },
    render: ({ title, body, imageUrl, imageAlt, imagePosition, headingTag }) => {
        const Heading = headingTag || "h2";
        return (
            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-10">
                <div className={imagePosition === "left" ? "md:order-2" : ""}>
                    <Heading className="text-3xl font-semibold text-primary md:text-4xl">{title}</Heading>
                    <div className="mt-5 text-base leading-7 text-stone-700" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary/30">
                    {imageUrl ? <img src={imageUrl} alt={imageAlt ?? ""} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-stone-500">Image</div>}
                </div>
            </section>
        );
    },
}

export type FeatureGridProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    columns: "2" | "3" | "4";
    items: { title: string; description: string }[];
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
}

export const FeatureGrid: ComponentConfig<FeatureGridProps> = {
    label: "Feature Grid",
    fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
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
        headingTag: "h2",
        description: "Use this section for product benefits, service highlights, or page-level selling points.",
        columns: "3",
        items: [
            { title: "Handcrafted", description: "Made with care by skilled artisans." },
            { title: "Natural materials", description: "Built around jute, cotton, wool, and honest textures." },
            { title: "Export quality", description: "Designed for homes, stores, and trade buyers." },
        ],
    },
    render: ({ eyebrow, title, description, columns, items, headingTag }) => {
        const Heading = headingTag || "h2";
        return (
            <section className="bg-white px-6 py-16 md:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 max-w-3xl">
                        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
                        <Heading className="text-3xl font-semibold text-primary md:text-4xl">{title}</Heading>
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
        );
    },
}

export type CtaProps = {
    title: string;
    description?: string;
    buttons: Button[];
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
}

export const Cta: ComponentConfig<CtaProps> = {
    label: "Call To Action",
    fields: {
        title: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
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
        headingTag: "h2",
        description: "Create a focused conversion moment for buyers and trade enquiries.",
        buttons: [{ label: "Explore Collection", href: "/", variant: "secondary" }],
    },
    render: ({ title, description, buttons, headingTag }) => {
        const Heading = headingTag || "h2";
        return (
            <section className="px-6 py-16 md:px-10">
                <div className="mx-auto max-w-5xl rounded-lg bg-primary px-6 py-12 text-center text-primary-content md:px-12">
                    <Heading className="text-3xl font-semibold">{title}</Heading>
                    {description && <p className="mx-auto mt-4 max-w-2xl text-primary-content/85">{description}</p>}
                    {buttons?.length > 0 && (
                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            {buttons.map(button => <Link key={`${button.label}-${button.href}`} href={button.href} className={`btn rounded ${buttonClass(button.variant)}`}>{button.label}</Link>)}
                        </div>
                    )}
                </div>
            </section>
        );
    },
}

export type FaqProps = {
    title: string;
    items: { question: string; answer: string }[];
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
}

export const Faq: ComponentConfig<FaqProps> = {
    label: "FAQ",
    fields: {
        title: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
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
        headingTag: "h2",
        items: [{ question: "What should visitors know?", answer: "Add a clear answer here." }],
    },
    render: ({ title, items, headingTag }) => {
        const Heading = headingTag || "h2";
        return (
            <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
                <Heading className="mb-6 text-3xl font-semibold text-primary">{title}</Heading>
                <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
                    {items.map((item, index) => (
                        <details key={index} className="group p-5">
                            <summary className="cursor-pointer list-none font-semibold text-stone-950">{item.question}</summary>
                            <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        );
    },
}

export type BrowseCategoryListProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
    align: "left" | "center";
    sourceType: "category" | "custom";
    categoryName?: string;
    customCards?: {
        name: string;
        link: string;
        image: string;
        description?: string;
    }[];
}

export const BrowseCategoryList: ComponentConfig<BrowseCategoryListProps> = {
    label: "Browse Category List",
    fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        description: { type: "text" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
        align: {
            type: "radio",
            label: "Card Alignment",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" }
            ]
        },
        sourceType: {
            type: "select",
            label: "Source Type",
            options: [
                { label: "Database Category Dropdown", value: "category" },
                { label: "Custom Option", value: "custom" }
            ]
        },
        categoryName: {
            ...CategorySelectorField,
            label: "Category Dropdown (active in Database mode)"
        } as any,
        customCards: {
            type: "array",
            label: "Custom Cards (active in Custom mode)",
            getItemSummary: item => item.name || "Custom Card",
            arrayFields: {
                name: { type: "text", label: "Name" },
                link: { type: "text", label: "Link" },
                image: { type: "text", label: "Image URL" },
                description: { type: "text", label: "Description (optional)" }
            },
            defaultItemProps: { name: "", link: "", image: "", description: "" }
        }
    },
    defaultProps: {
        eyebrow: "Browse",
        title: "Shop By Category",
        description: "Find the perfect handmade collection for your needs",
        headingTag: "h2",
        align: "left",
        sourceType: "category",
        categoryName: "",
        customCards: [
            { name: "Custom Card 1", link: "#", image: "", description: "Description 1" },
            { name: "Custom Card 2", link: "#", image: "", description: "Description 2" }
        ]
    },
    render: ({ eyebrow, title, description, headingTag, align, sourceType, categoryName, customCards }) => {
        const Heading = headingTag || "h2"
        const [allCategories, setAllCategories] = React.useState<any[]>([])
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
            let active = true
            const load = async () => {
                try {
                    const data = await getCategoriesForClient()
                    if (active) {
                        setAllCategories(data)
                        setLoading(false)
                    }
                } catch (e) {
                    console.error(e)
                    if (active) setLoading(false)
                }
            }
            load()
            return () => { active = false }
        }, [])

        const resolvedCards = React.useMemo(() => {
            if (sourceType === "category") {
                if (!categoryName) {
                    return [
                        { name: "Tote Bags", description: "Spacious everyday essentials", image: "", link: "#" },
                        { name: "Shoulder Bags", description: "Effortless elegance", image: "", link: "#" },
                        { name: "Crossbody Bags", description: "Hands-free convenience", image: "", link: "#" },
                        { name: "Beach Bags", description: "Summer must-haves", image: "", link: "#" }
                    ];
                }
                const parentCat = allCategories.find(c => c.name === categoryName);
                if (!parentCat) {
                    return [];
                }
                const parentPath = `${parentCat.parent ?? ""}${parentCat.name}>`;
                const subcategories = allCategories.filter(c => c.parent === parentPath);
                if (subcategories.length > 0) {
                    return subcategories.map(c => ({
                        name: c.name,
                        description: c.description || "",
                        image: c.imgSrc || c.banner || "",
                        link: c.slug ? `/products/category/${c.slug}` : "/products"
                    }));
                } else {
                    return [{
                        name: parentCat.name,
                        description: parentCat.description || "",
                        image: parentCat.imgSrc || parentCat.banner || "",
                        link: parentCat.slug ? `/products/category/${parentCat.slug}` : "/products"
                    }];
                }
            } else {
                const cards = customCards || [];
                if (cards.length === 0) {
                    return [
                        { name: "Custom Card 1", description: "Upload details in sidebar", image: "", link: "#" },
                        { name: "Custom Card 2", description: "Upload details in sidebar", image: "", link: "#" }
                    ];
                }
                return cards.map(c => ({
                    name: c.name || "Custom Card",
                    description: c.description || "",
                    image: c.image || "",
                    link: c.link || "#"
                }));
            }
        }, [sourceType, categoryName, customCards, allCategories]);

        const shouldCenter = align === "center" || resolvedCards.length === 2

        return (
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        {eyebrow && (
                            <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                                {eyebrow}
                            </p>
                        )}
                        <Heading className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            {title}
                        </Heading>
                        {description && <p className="text-lg text-gray-600">{description}</p>}
                    </div>

                    <div className={`flex flex-wrap gap-6 ${shouldCenter ? "justify-center" : "justify-start"}`}>
                        {loading && sourceType === "category" && categoryName ? (
                            <div className="w-full text-center py-10">
                                <span className="loading loading-spinner loading-md"></span>
                            </div>
                        ) : resolvedCards.length === 0 ? (
                            <div className="w-full text-center py-10 text-stone-400">
                                {sourceType === "category" ? "No subcategories found." : "Please add custom cards."}
                            </div>
                        ) : (
                            resolvedCards.map((cat, i) => (
                                <Link
                                    key={i}
                                    href={cat.link}
                                    className="group relative aspect-[3/4] w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 block"
                                >
                                    {cat.image ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-primary/80 group-hover:via-primary/30 transition-all duration-500" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white text-left">
                                        <h3 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300">{cat.name}</h3>
                                        <p className="text-sm text-white/80 group-hover:text-white transition-colors line-clamp-2">{cat.description}</p>
                                        <div className="mt-3 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            Explore <span className="inline-block ml-1">→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>
        )
    },
}

export type CategoryProductsProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    categoryName: string;
    limit: number;
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p" | "strong";
    buttonText?: string;
    buttonLink?: string;
}

export const CategoryProducts: ComponentConfig<CategoryProductsProps> = {
    label: "Category Products Grid",
    fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        description: richTextField,
        categoryName: CategorySelectorField,
        limit: { type: "number", label: "Product Limit" },
        headingTag: {
            type: "select",
            label: "Title Level",
            options: headingOptions,
        },
        buttonText: { type: "text", label: "Button Text (optional)" },
        buttonLink: { type: "text", label: "Button Link (optional)" },
    },
    defaultProps: {
        eyebrow: "The Collection",
        title: "Handmade Products",
        description: "Explore our beautiful handcrafted designs.",
        categoryName: "",
        limit: 8,
        headingTag: "h2",
        buttonText: "",
        buttonLink: "",
    },
    render: ({ eyebrow, title, description, categoryName, limit, headingTag, buttonText, buttonLink }) => {
        const Heading = headingTag || "h2"
        const [products, setProducts] = React.useState<any[]>([])
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
            let active = true
            const load = async () => {
                if (!categoryName) {
                    setLoading(false)
                    return
                }
                try {
                    const { serializeProductCardList } = await import("@/lib/productCardSerialization")
                    const rawProducts = await getProductsByCategoryForClient(categoryName, limit || 8)
                    if (active) {
                        const serialized = serializeProductCardList(rawProducts as any)
                        setProducts(serialized)
                        setLoading(false)
                    }
                } catch (e) {
                    console.error(e)
                    if (active) setLoading(false)
                }
            }
            load()
            return () => { active = false }
        }, [categoryName, limit])

        const [categorySlug, setCategorySlug] = React.useState<string>("")
        React.useEffect(() => {
            let active = true
            const loadSlug = async () => {
                if (!categoryName) return
                try {
                    const data = await getCategoriesForClient()
                    const cat = data.find(c => c.name === categoryName)
                    if (active && cat) {
                        setCategorySlug(cat.slug || "")
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            loadSlug()
            return () => { active = false }
        }, [categoryName])

        const finalButtonLink = buttonLink || (categorySlug ? `/products/category/${categorySlug}` : "/products")

        return (
            <section className="bg-white py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        {eyebrow && (
                            <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                                {eyebrow}
                            </p>
                        )}
                        <Heading className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                            {title}
                        </Heading>
                        {description && <div className="text-lg leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: description }} />}
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-stone-500">
                            No products found in this category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {products.map((product, i) => (
                                <ProductCardItem
                                    key={product._id || i}
                                    {...product}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}

                    {buttonText && (
                        <div className="mt-16 text-center">
                            <Link
                                href={finalButtonLink}
                                className="group inline-flex items-center gap-2 bg-primary text-primary-content font-semibold px-10 py-4 rounded-full hover:bg-primary/90 transition-all duration-300 text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                            >
                                {buttonText}
                                <span className="w-4 h-4 transition-transform group-hover:translate-x-1 inline-block">→</span>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        )
    }
}

export type PuckProps = {
    Hero: HeroProps;
    RichText: RichTextProps;
    ImageText: ImageTextProps;
    FeatureGrid: FeatureGridProps;
    Cta: CtaProps;
    Faq: FaqProps;
    BrowseCategoryList: BrowseCategoryListProps;
    CategoryProducts: CategoryProductsProps;
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
            components: ["Hero", "RichText", "ImageText", "FeatureGrid", "Cta", "Faq", "BrowseCategoryList", "CategoryProducts"],
        },
    },
    components: {
        Hero,
        RichText,
        ImageText,
        FeatureGrid,
        Cta,
        Faq,
        BrowseCategoryList,
        CategoryProducts,
    },
}

export default puckConfig
