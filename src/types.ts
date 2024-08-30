import type { Options } from "nodemailer/lib/smtp-transport";

export type MailMessage = {
  name?: string;
  to?: string;
  cc?: string;
  bcc?: string;
};

export interface ModuleOptions {
  message: MailMessage | MailMessage[];
  smtp: Options | string;
}

// we intentionally export an empty interface
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeConfig {}

export interface ModuleResolvedOptions {
  message: MailMessage[];
  smtp: Options | string;
}
