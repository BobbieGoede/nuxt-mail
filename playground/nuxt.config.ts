import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  alias: {
    "@goede/nuxt-mail": fileURLToPath(new URL("../src/module", import.meta.url)),
  },

  modules: ["@goede/nuxt-mail"],

  mail: {
    message: [
      {
        name: "config-1",
        cc: "123",
      },
      {
        name: "config-2",
        to: "example@mail.com",
      },
      {
        name: "config-3",
        to: "example@mail.com",
      },
    ],
    smtp: {
      host: "smtp.domain.com",
      port: 587,
      secure: false,
      auth: {
        user: "user@mail.com",
        pass: "mypassword",
      },
    },
  },

  compatibilityDate: "2024-08-29",
});
