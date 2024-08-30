import type { GeneratedTypeConfig } from "@goede/nuxt-mail";

export type GeneratedConfigNames = GeneratedTypeConfig extends Record<"configNames", infer ConfigName>
  ? ConfigName
  : never;

type ResolvedConfigNames = IsNever<GeneratedConfigNames> extends true ? number | string : GeneratedConfigNames;

export type IsNever<T> = [T] extends [never] ? true : false;

export interface MailBody {
  /**
   * Index or name of config to use
   */
  config?: ResolvedConfigNames;

  /**
   * Name of who triggered the email to be sent
   */
  from: string;

  /**
   * Email subject
   */
  subject: string;

  /**
   * Email text content
   */
  text: string;

  /**
   * The repient's email address
   * @internal This is set based on configuration
   */
  to?: string;

  /**
   * The cc email address
   * @internal This is set based on configuration
   */
  cc?: string;

  /**
   * The bcc email address
   * @internal This is set based on configuration
   */
  bcc?: string;
}
