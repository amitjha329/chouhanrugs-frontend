import getTermsConditionData from "@/backend/serverActions/getTermsConditionData";
import { type Locale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/pageMetadata";
import type { Metadata } from "next";
import getPageData from "@/backend/serverActions/getPageData";
import FAQSection from "@/ui/FAQSection";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: loc } = await props.params;
    return getStaticPageMetadata({
        pageKey: "terms",
        alternatePageKeys: ["t&c"],
        locale: loc as Locale,
        path: "terms",
        fallbackTitle: "Terms and Conditions | Chouhan Rugs",
        fallbackDescription: "Read the Chouhan Rugs terms and conditions.",
    });
}

const TandC = async (props: { params: Promise<{ locale: string }> }) => {
    const params = await props.params;
    const locale = params.locale as Locale;
    const [termsData, pageData] = await Promise.all([
        getTermsConditionData(),
        getPageData("terms").catch(() => null),
    ]);

    return (
        <>
            <div className="container max-w-3xl max-sm:px-5 mx-auto mt-10 mb-40">
                <h1 className="text-3xl text-center">{termsData?.title ?? ""}</h1>
                <div dangerouslySetInnerHTML={{ __html: termsData?.content ?? "" }}></div>
            </div>
            <FAQSection faqs={pageData?.faqs} locale={locale} />
        </>
    );
}

export default TandC;
