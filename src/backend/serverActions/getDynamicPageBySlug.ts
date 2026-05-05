import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import PageMetaDataModel from "@/types/PageMetaDataModel";

async function fetchDynamicPageBySlug(slug: string): Promise<PageMetaDataModel | null> {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
    const slugVariants = Array.from(new Set([
        cleanSlug,
        `/${cleanSlug}`,
    ]));

    const data = await (await clientPromise)
        .db(process.env.MONGODB_DB)
        .collection("pages")
        .findOne({
            isDynamic: true,
            draft: { $ne: true },
            $or: [
                { page: { $in: slugVariants } },
                { slug: { $in: slugVariants } },
                { "data.root.props.slug": { $in: slugVariants } },
            ],
        });

    return data ? JSON.parse(JSON.stringify(data)) as PageMetaDataModel : null;
}

const getDynamicPageBySlug = (slug: string): Promise<PageMetaDataModel | null> => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

    return unstable_cache(
        () => fetchDynamicPageBySlug(cleanSlug),
        [`dynamic-page-${cleanSlug}`],
        {
            revalidate: 3600,
            tags: ["pages", `page-${cleanSlug}`],
        },
    )();
};

export default getDynamicPageBySlug;
