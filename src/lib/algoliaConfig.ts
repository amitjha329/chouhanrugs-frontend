import "server-only";

import { getConfigBulk } from "@/lib/services/ConfigService";

const ALGOLIA_CONFIG_KEYS = ["ALGOLIA_APPID", "ALGOLIA_KEY_CLIENT", "ALGOLIA_INDEX"] as const;

export type PublicAlgoliaConfig = Record<(typeof ALGOLIA_CONFIG_KEYS)[number], string>;

function getEnvAlgoliaConfig(): PublicAlgoliaConfig {
    return {
        ALGOLIA_APPID: process.env.ALGOLIA_APPID ?? "",
        ALGOLIA_KEY_CLIENT: process.env.ALGOLIA_KEY_CLIENT ?? "",
        ALGOLIA_INDEX: process.env.ALGOLIA_INDEX ?? "",
    };
}

export async function getPublicAlgoliaConfig(): Promise<PublicAlgoliaConfig> {
    const envConfig = getEnvAlgoliaConfig();

    if (envConfig.ALGOLIA_APPID && envConfig.ALGOLIA_KEY_CLIENT && envConfig.ALGOLIA_INDEX) {
        return envConfig;
    }

    try {
        const dbConfig = await getConfigBulk([...ALGOLIA_CONFIG_KEYS]);
        return {
            ALGOLIA_APPID: dbConfig.ALGOLIA_APPID || envConfig.ALGOLIA_APPID,
            ALGOLIA_KEY_CLIENT: dbConfig.ALGOLIA_KEY_CLIENT || envConfig.ALGOLIA_KEY_CLIENT,
            ALGOLIA_INDEX: dbConfig.ALGOLIA_INDEX || envConfig.ALGOLIA_INDEX,
        };
    } catch (error) {
        console.error("Public Algolia config fetch failed:", error);
        return envConfig;
    }
}
