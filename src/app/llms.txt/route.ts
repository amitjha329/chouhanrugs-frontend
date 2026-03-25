export const runtime = 'edge';

/**
 * GET /llms.txt
 *
 * Returns a structured plain-text document describing the site for LLM
 * consumption (similar purpose to robots.txt but for AI agents).
 *
 * Native-Check: Uses the native `Response` constructor (Web API) and
 * template literals. No Markdown renderer or template engine added.
 *
 * NOTE: Edge Runtime is set per the architectural constraint. Site metadata
 * is fetched via `fetch()` from the same origin to stay edge-compatible
 * (the MongoDB driver requires Node.js APIs not available on the edge).
 */
export async function GET(request: Request): Promise<Response> {
    const origin = new URL(request.url).origin;

    // Fetch site metadata through the existing server-rendered endpoint
    // Falls back to static defaults if the internal fetch fails.
    let siteName = 'Chouhan Rugs';
    let siteDescription =
        'Premium handcrafted jute rugs, cotton rugs, jute hand bags, pillow & cushion covers from India.';
    let siteUrl = origin;
    let contactEmail = '';
    let contactPhone = '';

    try {
        const res = await fetch(`${origin}/api/mwHandler`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getSiteData' }),
        });
        if (res.ok) {
            const data = await res.json();
            siteName = data.title ?? siteName;
            siteDescription = data.description ?? siteDescription;
            siteUrl = data.url ?? siteUrl;
            contactEmail = data.contact_details?.email ?? '';
            contactPhone = data.contact_details?.phone ?? '';
        }
    } catch {
        // Non-fatal — serve with static fallback values
    }

    const body = `# ${siteName}

> ${siteDescription}

## About

${siteName} is an Indian manufacturer and exporter of handcrafted home
textiles. We specialise in jute rugs, cotton rugs, jute hand bags,
pillow & cushion covers, wall hangings, and macramé products.

## Website
- URL: ${siteUrl}
- Contact: ${contactEmail} | ${contactPhone}

## Docs
- [Full Product Catalog (plain text)](${siteUrl}/api/llms/products)
- [Featured Products](${siteUrl}/api/llms/featured)
- [Deals](${siteUrl}/api/llms/deals)

## Main Sections
- /products          — Browse all products
- /jute-rugs         — Jute rug collection
- /cotton-rugs       — Cotton rug collection
- /jute-hand-bags    — Jute hand bags
- /pillow-and-cushion-covers — Cushion covers
- /blog              — Articles & guides
- /about-us          — Company story
- /contact-us        — Get in touch

## Supported Locales
- en-IN (default) — English (India)
- en-US           — English (US)
- hi-IN           — Hindi
- en-GB           — English (UK)
- ar              — Arabic
`;

    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
