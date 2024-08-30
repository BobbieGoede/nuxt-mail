import type { MailBody } from "./types";
import { FetchError } from "ofetch";

export async function send(config: MailBody) {
  try {
    await $fetch("/mail/send", { body: config, method: "POST" });
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      // type mismatch
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const message = error.response?._data?.statusMessage;
      if (typeof message === "string") {
        throw new Error(message);
      }
    }
  }
}
