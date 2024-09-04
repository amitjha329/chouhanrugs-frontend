import { MongoClient, MongoClientOptions } from 'mongodb'
let uri = process.env.MONGODB
const options = {
} as MongoClientOptions

let clientPromise: Promise<MongoClient>
if (process.env.NODE_ENV == "development" && uri) {
    let globalwithMongo = global as typeof globalThis & {
        _mongoClientPromise: Promise<MongoClient>
    }
    if (!globalwithMongo._mongoClientPromise) {
        globalwithMongo._mongoClientPromise = MongoClient.connect(uri, options)
    }
    clientPromise = globalwithMongo._mongoClientPromise
} else if (uri) {
    clientPromise = MongoClient.connect(uri, options)
} else {
    throw Error("MongoDB Uri Not Defined")
}

export default clientPromise