declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;
declare const __APP_DESCRIPTION__: string;
declare const __APP_AUTHOR__: string;
declare const __APP_AUTHOR_GITHUB__: string;
declare const __APP_LICENSE__: string;
declare const __APP_REPOSITORY__: string;

declare module "*.css" {
  const content: string;
  export default content;
}
