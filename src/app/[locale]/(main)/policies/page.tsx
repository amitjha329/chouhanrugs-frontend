import getPoliciesData from "@/backend/serverActions/getPoliciesData";
import { type Locale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/pageMetadata";
import type { Metadata } from "next";
import getPageData from "@/backend/serverActions/getPageData";
import FAQSection from "@/ui/FAQSection";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: loc } = await props.params;
    return getStaticPageMetadata({
        pageKey: "policies",
        locale: loc as Locale,
        path: "policies",
        fallbackTitle: "Policies | Chouhan Rugs",
        fallbackDescription: "Read Chouhan Rugs policies for orders, shipping, returns, and customer support.",
    });
}

const Policies = async (props: { params: Promise<{ locale: string }> }) => {
    const params = await props.params;
    const locale = params.locale as Locale;
    const [policiesData, pageData] = await Promise.all([
        getPoliciesData(),
        getPageData("policies").catch(() => null),
    ]);

    return (
        <>
            <div className="container max-w-3xl max-sm:px-5 mx-auto mt-10 mb-40">
                <h1 className="text-3xl text-center">{policiesData?.title ?? ""}</h1>
                <div dangerouslySetInnerHTML={{ __html: policiesData?.content ?? "" }}></div>
            </div>
            <FAQSection faqs={pageData?.faqs} locale={locale} />
        </>
    );
}

export default Policies;
