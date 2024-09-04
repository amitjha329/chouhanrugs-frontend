"use server"
import clientPromise from "../mongodb/clientPromise";
import DashboardData from "../types/DashboardData";

export default async function dastboardData(): Promise<DashboardData> {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collectionCat = db.collection("categories")
    const collectionPro = db.collection("products")
    const collectionUsers = db.collection("users")
    const collectionTags = db.collection("tags")
    const collectionOrders = db.collection("orders")

    const catCount = await collectionCat.countDocuments()
    const prodCount = await collectionPro.countDocuments()
    const userCount = await collectionUsers.countDocuments()
    const tagsCount = await collectionTags.countDocuments()
    const orderCount = await collectionOrders.countDocuments()
    const orderDelCount = await collectionOrders.countDocuments({ orderStatus: "delivered" })
    const orderPenCount = await collectionOrders.countDocuments({ orderStatus: "pending" })
    const orderRetCount = await collectionOrders.countDocuments({ orderStatus: "returned" })
    const orderCountToday = await collectionOrders.countDocuments({ "orderPlacedOn": { "$gte": (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime(), "$lt": (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() + 86400000 } })
    const orderCountMonth = await collectionOrders.countDocuments({ "orderPlacedOn": { "$gte": (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() - 2629746000, "$lt": Date.now() } })
    const orderCountYear = await collectionOrders.countDocuments({ "orderPlacedOn": { "$gte": (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() - 31556952000, "$lt": Date.now() } })
    const earningToday = await collectionOrders.aggregate([
        {
            $addFields: {
                orderValue: {
                    $cond: {
                        if: {
                            $eq: ["$userCurrency.currency", "INR"]
                        },
                        then: {
                            $divide: [
                                "$orderValue",
                                "$userCurrency.exchangeRates"
                            ]
                        },
                        else: "$orderValue"
                    }
                }
            }
        },
        {
            $match: {
                orderPlacedOn: {
                    $gte: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime(),
                    $lt: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() + 86400000
                }
            }
        },
        {
            $group: {
                _id: null,
                earning: {
                    $sum: "$orderValue"
                }
            }
        }
    ]).toArray()

    const earningMonth = await collectionOrders.aggregate([
        {
            $addFields: {
                orderValue: {
                    $cond: {
                        if: {
                            $eq: ["$userCurrency.currency", "INR"]
                        },
                        then: {
                            $divide: [
                                "$orderValue",
                                "$userCurrency.exchangeRates"
                            ]
                        },
                        else: "$orderValue"
                    }
                }
            }
        },
        {
            $match: {
                orderPlacedOn: {
                    $gte: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() - 2629746000,
                    $lt: Date.now()
                }
            }
        },
        {
            $group: {
                _id: null,
                earning: {
                    $sum: "$orderValue"
                }
            }
        }
    ]).toArray()

    const earningYear = await collectionOrders.aggregate([
        {
            $addFields: {
                orderValue: {
                    $cond: {
                        if: {
                            $eq: ["$userCurrency.currency", "INR"]
                        },
                        then: {
                            $divide: [
                                "$orderValue",
                                "$userCurrency.exchangeRates"
                            ]
                        },
                        else: "$orderValue"
                    }
                }
            }
        },
        {
            $match: {
                orderPlacedOn: {
                    $gte: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).getTime() - 31556952000,
                    $lt: Date.now()
                }
            }
        },
        {
            $group: {
                _id: null,
                earning: {
                    $sum: "$orderValue"
                }
            }
        }
    ]).toArray()

    const earningAll = await collectionOrders.aggregate([
        {
            $addFields: {
                orderValue: {
                    $cond: {
                        if: {
                            $eq: ["$userCurrency.currency", "INR"]
                        },
                        then: {
                            $divide: [
                                "$orderValue",
                                "$userCurrency.exchangeRates"
                            ]
                        },
                        else: "$orderValue"
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                earning: {
                    $sum: "$orderValue"
                }
            }
        }
    ]).toArray()

    return {
        orders: {
            total: orderCount,
            delivered: orderDelCount,
            month: orderCountMonth,
            pending: orderPenCount,
            return: orderRetCount,
            today: orderCountToday,
            year: orderCountYear,
        },
        earning: {
            month: earningMonth[0]?.earning ?? 0,
            today: earningToday[0]?.earning ?? 0,
            total: earningAll[0]?.earning ?? 0,
            year: earningYear[0]?.earning ?? 0
        },
        general: {
            cats: catCount,
            prod: prodCount,
            tags: tagsCount,
            user: userCount,
        }
    }
}