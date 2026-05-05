import getTermsConditionData from "@/backend/serverActions/getTermsConditionData";
import { type Locale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/pageMetadata";
import type { Metadata } from "next";

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

const TandC = async () => {
    const termsData = await getTermsConditionData()
    return (<div className="container max-w-3xl max-sm:px-5 mx-auto mt-10 mb-40">
        <h1 className="text-3xl text-center">{termsData?.title ?? ""}</h1>
        <div dangerouslySetInnerHTML={{ __html: termsData?.content ?? "" }}></div>
    </div>);
}

export default TandC;
