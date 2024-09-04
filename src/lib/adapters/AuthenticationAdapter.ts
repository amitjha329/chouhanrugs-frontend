import { ObjectId } from "mongodb"

import type {
    Adapter,
    AdapterAccount,
    AdapterSession,
    VerificationToken,
} from "next-auth/adapters"
import type { MongoClient } from "mongodb"
import MongoDBAdapterOptions from "@/lib/types/MongoDBAdapterOptions"
import UserModel from "@/lib/types/UserModel"
import converter, { _id } from "@/lib/utilities/mongoObjectConversionUtility"

export const defaultCollections: Required<
    Required<MongoDBAdapterOptions>["collections"]
> = {
    Users: "users",
    Accounts: "accounts",
    Sessions: "sessions",
    VerificationTokens: "verification_tokens",
}

export function AuthenticationAdapter(
    client: Promise<MongoClient>,
    options: MongoDBAdapterOptions = {}
): Adapter {
    const { collections } = options
    const { from, to } = converter

    const db = (async () => {
        const _db = (await client).db(options.databaseName)
        const c = { ...defaultCollections, ...collections }
        return {
            U: _db.collection<UserModel>(c.Users),
            A: _db.collection<AdapterAccount>(c.Accounts),
            S: _db.collection<AdapterSession>(c.Sessions),
            V: _db.collection<VerificationToken>(c?.VerificationTokens),
        }
    })()

    return {
        async createUser(data) {
            const user = to<UserModel>({ ...data, roles: ["user"] })
            await (await db).U.insertOne(user)
            return from<UserModel>(user)
        },
        async getUser(id) {
            const user = await (await db).U.findOne({ _id: _id(id) })
            if (!user) return null
            return from<UserModel>(user)
        },
        async getUserByEmail(email) {
            const user = await (await db).U.findOne({ email })
            if (!user) return null
            return from<UserModel>(user)
        },
        async getUserByAccount(provider_providerAccountId) {
            const account = await (await db).A.findOne(provider_providerAccountId)
            if (!account) return null
            const user = await (
                await db
            ).U.findOne({ _id: new ObjectId(account.userId) })
            if (!user) return null
            return from<UserModel>(user)
        },
        async updateUser(data) {
            const { _id, ...user } = to<UserModel>(data)

            const result = await (
                await db
            ).U.findOneAndUpdate({ _id }, { $set: user }, { returnDocument: "after" })

            return from<UserModel>(result!)
        },
        async deleteUser(id) {
            const userId = _id(id)
            const m = await db
            await Promise.all([
                m.A.deleteMany({ userId: userId as any }),
                m.S.deleteMany({ userId: userId as any }),
                m.U.deleteOne({ _id: userId }),
            ])
        },
        linkAccount: async (data) => {
            const account = to<AdapterAccount>(data)
            await (await db).A.insertOne(account)
            return account
        },
        async unlinkAccount(provider_providerAccountId) {
            const account = await (
                await db
            ).A.findOneAndDelete(provider_providerAccountId)
            return from<AdapterAccount>(account!)
        },
        async getSessionAndUser(sessionToken) {
            const session = await (await db).S.findOne({ sessionToken })
            if (!session) return null
            const user = await (
                await db
            ).U.findOne({ _id: new ObjectId(session.userId) })
            if (!user) return null
            return {
                user: from<UserModel>(user),
                session: from<AdapterSession>(session),
            }
        },
        async createSession(data) {
            const session = to<AdapterSession>(data)
            await (await db).S.insertOne(session)
            return from<AdapterSession>(session)
        },
        async updateSession(data) {
            const { _id, ...session } = to<AdapterSession>(data)

            const result = await (
                await db
            ).S.findOneAndUpdate(
                { sessionToken: session.sessionToken },
                { $set: session },
                { returnDocument: "after" }
            )
            return from<AdapterSession>(result!)
        },
        async deleteSession(sessionToken) {
            const session = await (
                await db
            ).S.findOneAndDelete({
                sessionToken,
            })
            return from<AdapterSession>(session!)
        },
        async createVerificationToken(data) {
            await (await db).V.insertOne(to(data))
            return data
        },
        async useVerificationToken(identifier_token) {
            const verificationToken = await (
                await db
            ).V.findOneAndDelete(identifier_token)

            if (!verificationToken) return null
            //@ts-ignore
            delete verificationToken._id
            return verificationToken
        },
    }
}