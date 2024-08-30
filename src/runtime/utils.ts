import type { MailBody } from "./types";
import { FetchError } from "ofetch";

export async function send(config: MailBody) {
  try {
    await $fetch("/mail/send", { body: config, method: "POST" });
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      throw new Error(error.response?._data.statusMessage);
    }
  }
}
