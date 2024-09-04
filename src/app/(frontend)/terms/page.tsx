import getTermsConditionData from "@/lib/actions/getTermsConditionData";

const TandC = async () => {
    const termsData = await getTermsConditionData()
    return (<div className="container max-w-3xl max-sm:px-5 mx-auto mt-10 mb-40">
        <h1 className="text-3xl text-center">{termsData?.title ?? ""}</h1>
        <div dangerouslySetInnerHTML={{ __html: termsData?.content ?? "" }}></div>
    </div>);
}

export default TandC;