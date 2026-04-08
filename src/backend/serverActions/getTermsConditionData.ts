'use server'

import { unstable_cache } from 'next/cache'
import clientPromise from "@/lib/clientPromise"
import TermsAndPoliciesDataModel from "@/types/TermsAndPoliciesDataModel"

export default async function getTermsConditionData(): Promise<TermsAndPoliciesDataModel> {
    return unstable_cache(
        async () => {
            try {
                const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "terms", dataType: "terms_page" })
                return JSON.parse(JSON.stringify(data)) as TermsAndPoliciesDataModel
            } catch (error) {
                console.error(error)
                throw new Error(error?.toString())
            }
        },
        ['terms-condition-data'],
        { tags: ['pages', 'page-terms'], revalidate: 3600 }
    )()
}