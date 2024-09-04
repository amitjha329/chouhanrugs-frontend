
import clientPromise from "@/lib/mongodb/clientPromise"
import algoliasearch from "algoliasearch"
import { NextApiRequest, NextApiResponse } from "next/types"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const algoliaCLient = algoliasearch(process.env.ALGOLIA_APPID ?? "", process.env.ALGOLIA_KEY ?? "")
        const index = algoliaCLient.initIndex(process.env.ALGOLIA_INDEX ?? "")
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").find({}).toArray()
        const jsonRes: any[] = []
        for (let i = 0; i < insertResponse.length; i++) {
            const { _id, ...algEntry } = insertResponse[i]
            // await index.saveObject({
            //     objectID: _id.toHexString(),
            //     ...algEntry
            // })
            jsonRes.push({
                objectID: _id.toHexString(),
                ...algEntry
            })
        }
        res.json(jsonRes)
    } catch (error) {
        console.error(error)
        res.json({
            ack: true,
            result: {
                code: "ERROR",
                data: null
            }
        })
    }
}

export default handler
