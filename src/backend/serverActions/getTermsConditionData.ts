'use server'

import clientPromise from "../mongodb/clientPromise"

export default async function getTermsConditionData(): Promise<TermsAndPoliciesDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "terms", dataType: "terms_page" })
        return JSON.parse(JSON.stringify(data)) as TermsAndPoliciesDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}