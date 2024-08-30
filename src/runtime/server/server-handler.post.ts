import nodemailer from "nodemailer";
import { createError, defineEventHandler, readBody } from "h3";

// name is replaced at build time
import { options } from "#internal/__MODULE_NAME__/options.mjs";

import type { Transporter } from "nodemailer";
import type { ModuleResolvedOptions } from "virtual:nuxt-mail-types";
import type { MailBody } from "../types";

async function send(body: MailBody, options: ModuleResolvedOptions, transport: Transporter) {
  // type assertion due to conflicts between generated/built types
  let configIndexer = (body.config ?? 0) as string | number;

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
