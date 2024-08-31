import nodemailer from "nodemailer";
import { createError, defineEventHandler, readBody } from "h3";

import { options } from "#internal/@goede/nuxt-mail/options.mjs";

import type { Transporter } from "nodemailer";
import type { ModuleResolvedOptions } from "@goede/nuxt-mail";
import type { MailBody } from "../types";

async function send(body: MailBody, options: ModuleResolvedOptions, transport: Transporter) {
  let configIndexer = body.config ?? 0;

  if (typeof configIndexer === "string") {
    const configIndex = options.message.findIndex((messageConfig) => messageConfig.name === configIndexer);

    if (configIndex === -1) {
      throw new Error(`Message config with name '${configIndexer}' not found.`);
    }

    configIndexer = configIndex;
  } else if (configIndexer in options.message === false) {
    throw new Error(`Message config not found at index ${configIndexer}.`);
  }

  const { config, to, cc, bcc, ...restBody } = body;
  const { name, ...restBodyConfig } = options.message[configIndexer];

  await transport.sendMail({
    ...restBody,
    ...restBodyConfig,
  });
}

const transport = nodemailer.createTransport(options.smtp);

export default defineEventHandler(async (event) => {
  try {
    await send(await readBody(event), options, transport);
  } catch (error: unknown) {
    if (error instanceof Error) throw createError({ statusCode: 500, statusMessage: error.message });
    throw error;
  }

  return "";
});
