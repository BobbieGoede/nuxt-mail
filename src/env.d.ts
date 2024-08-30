declare const __MODULE_NAME__: string;

declare module "@goede/nuxt-mail" {
  // we intentionally export an empty interface
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GeneratedTypeConfig {}
}

import type { ModuleResolvedOptions } from "./module";

declare module "virtual:nuxt-mail-types" {
  export type { ModuleResolvedOptions };
}
