import nodemailer from "nodemailer";
import { createError, defineEventHandler, readBody } from "h3";

// @ts-expect-error virtual file
import options from "#internal/__MODULE_NAME__/options.mjs";

import type { Transporter } from "nodemailer";
import type { ModuleResolvedOptions } from "~/src/module";
import type { MailBody } from "../types";

async function send(body: MailBody, options: ModuleResolvedOptions, transport: Transporter) {
  body.config ??= 0;

  if (typeof body.config === "string") {
    const configIndex = options.message.findIndex((messageConfig) => messageConfig.name === body.config);

    if (configIndex === -1) {
      throw new Error(`Message config with name '${body.config}' not found.`);
    }

    body.config = configIndex;
  } else if (!options.message[body.config]) {
    throw new Error(`Message config not found at index ${body.config}.`);
  }

  const { config, to, cc, bcc, ...restBody } = body;
  const { name, ...restBodyConfig } = options.message[body.config];

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
    // @ts-expect-error unknown type
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return "";
});
