type MongoDBAdapterOptions = {
    collections?: {
        Users?: string
        Accounts?: string
        Sessions?: string
        VerificationTokens?: string
    }
    databaseName?: string
}

export default MongoDBAdapterOptions