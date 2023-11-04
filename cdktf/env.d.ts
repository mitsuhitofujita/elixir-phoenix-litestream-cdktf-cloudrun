declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        CDKTF_BACKEND_BUCKET: string;
        CDKTF_ENVIRONMENT: string;
        CDKTF_LOCATION: string;
        CDKTF_PREFIX: string;
        GOOGLE_CLOUD_PROJECT: string;
        LITESTREAM_DATABASE_PATH: string;
        LITESTREAM_REPLICA_URL: string;
        PHOENIX_DATABASE_PATH: string;
        PHOENIX_ENVIRONMENT: string;
        PHOENIX_SECRET_KEY_BASE: string;
      }
    }
  }
}
