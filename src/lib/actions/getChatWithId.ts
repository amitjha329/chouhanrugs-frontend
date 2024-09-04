'use server';
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise"
import converter from "../utilities/mongoObjectConversionUtility"
import ChatMsgListDataModel from "../types/ChatMsgListDataModel"

export default async function getChatWithId(id: string): Promise<ChatMsgListDataModel> {
    console.log(id)
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("chats").findOne({ _id: new ObjectId(id) })
        if (data != null)
            return converter.fromWithNoFieldChange<ChatMsgListDataModel>(data)
        else
            return { _id: id, messages: [] }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}