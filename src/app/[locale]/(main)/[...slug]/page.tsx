import getDynamicPageBySlug from "@/backend/serverActions/getDynamicPageBySlug";
import DynamicPageRenderer from "@/ui/DynamicPages/DynamicPageRenderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type DynamicPageProps = {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
};

const RESERVED_ROUTE_PREFIXES = new Set([
    "blog",
    "cart",
    "invoice",
    "order",
    "payment",
    "products",
    "signin",
    "track-order",
    "unsubscribe",
    "user",
]);

const isReservedRoute = (slug: string[]) => RESERVED_ROUTE_PREFIXES.has(slug[0] ?? "");

export async function generateMetadata(props: DynamicPageProps): Promise<Metadata> {
    const { slug } = await props.params;
    if (isReservedRoute(slug)) {
        return {};
    }

    const page = await getDynamicPageBySlug(slug.join("/"));

    if (!page) {
        return {};
    }

    const rootProps = page.data?.root?.props as Record<string, unknown> | undefined;
    const title = String(rootProps?.metatitle ?? rootProps?.title ?? "");
    const description = String(rootProps?.description ?? "");
    const keywords = Array.isArray(rootProps?.keywords)
        ? rootProps.keywords.map((item: { keyword?: string }) => item.keyword).filter(Boolean).join(", ")
        : "";
    const robotsIndex = rootProps?.robotsIndex !== false;
    const robotsFollow = rootProps?.robotsFollow !== false;
    const canonical = String(rootProps?.canonicalOverride ?? "") || `/${page.slug ?? page.page}`;

    return {
        title,
        description,
        keywords,
        robots: {
            index: robotsIndex,
            follow: robotsFollow,
        },
        alternates: {
            canonical,
        },
        openGraph: {
            title: String(rootProps?.socialTitle ?? title),
            description: String(rootProps?.socialDescription ?? description),
            images: rootProps?.socialImage ? [String(rootProps.socialImage)] : undefined,
        },
    };
}

export default async function DynamicPage(props: DynamicPageProps) {
    const { slug } = await props.params;
    if (isReservedRoute(slug)) {
        notFound();
    }

    const page = await getDynamicPageBySlug(slug.join("/"));

    if (!page) {
        notFound();
    }

    if (!page.data) {
        notFound();
    }

    return <DynamicPageRenderer data={page.data} />;
}
