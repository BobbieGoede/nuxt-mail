declare module "#internal/@goede/nuxt-mail/options.mjs" {
  export const options: import("./src/module.ts").ModuleResolvedOptions;
}

declare module "@goede/nuxt-mail" {
  // intentionally export an empty interface for generated augmentation
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GeneratedTypeConfig {}
  export type ModuleResolvedOptions = import("./src/module.ts").ModuleResolvedOptions;
}
