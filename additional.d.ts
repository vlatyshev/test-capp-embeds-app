declare namespace NodeJS {
    interface ProcessEnv {
        // .env
        readonly API_BEARER_TOKEN: string;
        readonly NEXT_PUBLIC_API_URL: string;
    }
}
