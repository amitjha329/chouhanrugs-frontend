import { NextRequest } from "next/server";

function generateSiteMap() {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>https://chouhanrugs.com/post-sitemap.xml</loc>
	</sitemap>
	<sitemap>
		<loc>https://chouhanrugs.com/page-sitemap.xml</loc>
	</sitemap>
	<sitemap>
		<loc>https://chouhanrugs.com/product-sitemap.xml</loc>
	</sitemap>
	<!-- sitemap>
		<loc>https://chouhanrugs.com/category-sitemap.xml</loc>
	</sitemap -->
</sitemapindex>
 `;
}

export async function GET(req: NextRequest) {
    return new Response(generateSiteMap(),{
        headers:{
            'Content-Type':"text/xml"
        }
    })
}