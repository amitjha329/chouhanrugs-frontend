import getPoliciesData from "@/backend/serverActions/getPoliciesData";

const Policies = async () => {
    const policiesData = await getPoliciesData()
    return (<div className="container max-w-3xl max-sm:px-5 mx-auto mt-10 mb-40">
        <h1 className="text-3xl text-center">{policiesData?.title ?? ""}</h1>
        <div dangerouslySetInnerHTML={{ __html: policiesData?.content ?? "" }}></div>
    </div>);
}

export default Policies;