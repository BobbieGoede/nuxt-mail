export default defineNuxtConfig({
  modules: ["@goede/nuxt-mail"],

  mail: {
    message: [
      { name: "bcc", bcc: "johndoe@gmail.com" },
      { name: "cc", cc: "johndoe@gmail.com" },
      { name: "cc-bcc", cc: "cc@gmail.com", bcc: "bcc@gmail.com" },
    ],
    smtp: {},
  },

  compatibilityDate: "2024-08-29",
});
