import clientPromise from "@/lib/mongodb/clientPromise";
import { ProductDataModel } from "@/lib/types/ProductDataModel";
import { NextRequest } from "next/server";
export const dynamic = 'force-dynamic'

function generateSiteMap(posts: ProductDataModel[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts.map(({ productURL, images, updatedOn }) => {
        return `
        <url>
            <loc>${`https://chouhanrugs.com/products/${productURL}`}</loc>
            ${
                images.map(img=>`
                <image:image>
                <image:loc>${img}</image:loc>
                </image:image>
            `)
            }
            <lastmod>${new Date(updatedOn).toISOString()}</lastmod>
        </url>
     `;
    })
            .join('')}
   </urlset>
 `;
}

export async function GET(req: NextRequest) {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const productsCollection = db.collection('products')
    try {
        const blogList = await productsCollection.find({}).sort("updatedOn", "desc").toArray()
        return new Response(generateSiteMap(blogList as unknown as ProductDataModel[]), {
            headers: {
                'Content-Type': "text/xml"
            }
        })
    } catch (err) {
        console.log(err)
    }
}