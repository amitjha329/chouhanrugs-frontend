import { Adapter, AdapterUser as DefaultAdapterUser } from "next-auth/adapters";
import { MongoClient } from "mongodb";
import { MongoDBAdapter as DefaultAdapter, MongoDBAdapterOptions } from "@auth/mongodb-adapter";

export const defaultCollections: Required<
    Required<MongoDBAdapterOptions>["collections"]
> = {
    Users: "users",
    Accounts: "accounts",
    Sessions: "sessions",
    VerificationTokens: "verification_tokens",
}

interface AdapterUser extends DefaultAdapterUser {
    roles: string[]
}

export default function MongoDBAdapter(
    client: | MongoClient
        | Promise<MongoClient>
        | (() => MongoClient | Promise<MongoClient>),
    options?: any
): Adapter {
    const adapter = DefaultAdapter(client, options);

    return {
        ...adapter,
        async getUser(id: string) {
            const user = await adapter.getUser!(id);
            if (user) {
                const roles = (user as AdapterUser).roles || [];

                return {
                    ...user,
                    roles,
                };
            }
            return null;
        },
    };
}
