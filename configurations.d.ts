declare const __MODULE_NAME__: string;

declare module "@goede/nuxt-mail" {
  // we intentionally export an empty interface
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GeneratedTypeConfig {}
}
// import type { ModuleResolvedOptions } from "./src/types.ts";
declare module "#internal/__MODULE_NAME__/options.mjs" {
  import type { Options } from "nodemailer/lib/smtp-transport";

  export interface ModuleResolvedOptions {
    message: MailMessage[];
    smtp: Options | string;
  }

  export const options: ModuleResolvedOptions;
}

declare module "virtual:nuxt-mail-types" {
  export type { ModuleResolvedOptions } from "./src/types";
}
