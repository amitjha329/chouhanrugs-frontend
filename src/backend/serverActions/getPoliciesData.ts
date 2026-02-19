'use server'

import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise"
import TermsAndPoliciesDataModel from "@/types/TermsAndPoliciesDataModel"


export default async function getPoliciesData(): Promise<TermsAndPoliciesDataModel> {
    await connection()
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "policies", dataType: "policies_page" })
        return JSON.parse(JSON.stringify(data)) as TermsAndPoliciesDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}