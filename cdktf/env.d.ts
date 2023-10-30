declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_CLOUD_PROJECT: string;
        WEB_CONTAINER_IMAGE_TAG: string;
      }
    }
  }
}
