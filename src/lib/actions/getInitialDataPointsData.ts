'use server'
import clientPromise from "../mongodb/clientPromise";
import AdminDataPointsModel from "../types/AdminDataPointsModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getInitialDataPointsData(): Promise<AdminDataPointsModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("data_points").findOne({
            dataFor: "notification"
        })
        if (data != null)
            return converter.fromWithNoFieldChange<AdminDataPointsModel>(data)
        else
            return {
                _id: "",
                bulkOrders:0,
                newOrder:false,
                notifCount:0,
                pendingOrders:0,
                processingOrders:0,
            }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}