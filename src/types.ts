import type { Options } from "nodemailer/lib/smtp-transport";

type MarkRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// intentionally export an empty interface for generated augmentation
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeConfig {}

export interface ModuleOptions {
  message: MailMessage | MailMessage[];
  smtp: Options | string;
}

/**
 * @internal `message` normalized to array
 */
export interface ModuleResolvedOptions {
  message: MailMessage[];
  smtp: Options | string;
}

type MailRecipient = {
  to?: string;
  cc?: string;
  bcc?: string;
};

// marks at least one of `to`, `cc`, `bcc` required
type RequiredMailRecipient =
  | MarkRequired<MailRecipient, "to">
  | MarkRequired<MailRecipient, "cc">
  | MarkRequired<MailRecipient, "bcc">;

export type MailMessage = {
  name?: string;
  from?: string;
  subject?: string;
  text?: string;
} & RequiredMailRecipient;
