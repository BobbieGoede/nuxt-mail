import { defineNuxtPlugin } from "#imports";
import { send } from "./utils";

export default defineNuxtPlugin({
  name: "nuxt-mail:plugin",
  setup() {
    return {
      provide: { mail: { send } },
    };
  },
});
