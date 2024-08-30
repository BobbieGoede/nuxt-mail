import { defineNuxtPlugin } from "#app";
import { send } from "./utils";

export default defineNuxtPlugin({
  name: "nuxt-mail:plugin",
  setup() {
    return {
      provide: { mail: { send } },
    };
  },
});
