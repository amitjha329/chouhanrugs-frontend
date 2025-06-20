declare namespace NodeJS {
    interface ProcessEnv {
        MONGODB: string;
        MONGODB_DB: string;
        AUTH_URL: string;
        NEXTCDN: string;
        NEXTAUTH_SECRET: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        GITHUB_TOKEN: string;
        // PayPal_API can be sandbox or live, so optional
        PayPal_API?: string;
        APILAYER_KEY: string;
        APILAYER_BASE: string;
        APILAYER_ARG_DEFAULTCURRENCY: string;
        APILAYER_ARG_CURRENCIES: string;
        ALGOLIA_APPID: string;
        ALGOLIA_KEY: string;
        ALGOLIA_KEY_CLIENT: string;
        ALGOLIA_INDEX: string;
        ALGOLIA_QUERY_INDEX: string;

        EMAIL_SERVER_USER: string;
        EMAIL_SERVER_PASSWORD: string;
        EMAIL_SERVER_HOST: string;
        EMAIL_SERVER_PORT: string;
        EMAIL_FROM: string;
    }
}