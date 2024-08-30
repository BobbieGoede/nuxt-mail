export default defineNuxtConfig({
  modules: ["@goede/nuxt-mail"],

  mail: {
    message: [
      {
        name: "myConfig",
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
