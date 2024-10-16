import { NextRequest } from "next/server";

function generateSiteMap() {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://chouhanrugs.com</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/contact-us</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/jute-rugs</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/cotton-rugs</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/jute-hand-bags</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/pillow-and-cushion-covers</loc>
        </url>
        <url>
            <loc>https://chouhanrugs.com/blog</loc>
        </url>
   </urlset>
 `;
}

export async function GET(req: NextRequest) {
    return new Response(generateSiteMap(), {
        headers: {
            'Content-Type': "text/xml"
        }
    })
}