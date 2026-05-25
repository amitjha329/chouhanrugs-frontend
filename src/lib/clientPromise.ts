import { MongoClient, MongoClientOptions } from 'mongodb'
let uri = process.env.MONGODB
const options = {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE ?? 3),
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 30_000,
    connectTimeoutMS: 30_000,
    socketTimeoutMS: 60_000,
    retryReads: true,
    retryWrites: true,
} as MongoClientOptions

let clientPromise: Promise<MongoClient>
const createClientPromise = () => {
    if (!uri) {
        throw Error("MongoDB Uri Not Defined")
    }

    return MongoClient.connect(uri, options)
}

let globalwithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
}

if (uri) {
    if (!globalwithMongo._mongoClientPromise) {
        globalwithMongo._mongoClientPromise = createClientPromise().catch((error) => {
            globalwithMongo._mongoClientPromise = undefined
            throw error
        })
    }

    clientPromise = globalwithMongo._mongoClientPromise
} else {
    throw Error("MongoDB Uri Not Defined")
}

export default clientPromise
