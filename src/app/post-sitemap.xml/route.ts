import clientPromise from "@/lib/clientPromise";
import BlogDataModel from "@/types/BlogDataModel";
import { connection, NextRequest } from "next/server";

function generateSiteMap(posts: BlogDataModel[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts.map(({ slug, featuredImage,updated }) => {
        return `
        <url>
            <loc>${`https://chouhanrugs.com/blog/${slug}`}</loc>
            <image:image>
                <image:loc>${featuredImage}</image:loc>
            </image:image>
            <lastmod>${new Date(updated).toISOString()}</lastmod>
        </url>
     `;
    })
            .join('')}
   </urlset>
 `;
}

export async function GET(req: NextRequest) {
    await connection()

    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const blogsCollection = db.collection('blogs')
    try {
        const blogList = await blogsCollection.find({}).sort("updatedOn", "desc").toArray()
        return new Response(generateSiteMap(blogList as unknown as BlogDataModel[]), {
            headers: {
                'Content-Type': "text/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=86400",
            }
        })
    } catch (err) {
        console.log(err)
    }
}
