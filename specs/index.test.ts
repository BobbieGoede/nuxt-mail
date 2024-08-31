import { beforeEach, it, describe, expect, beforeAll } from "vitest";
import { createPage, setup } from "@nuxt/test-utils/e2e";
import { fileURLToPath } from "node:url";
import * as smtpTester from "smtp-tester";

let mailServer: smtpTester.MailServer;
beforeAll(async () => {
  mailServer = smtpTester.init(7777);
});

beforeEach(async () => {
  (await import("consola")).default.restoreConsole();
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    ["mail"]?: Partial<import("../src/module.js").ModuleOptions>;
  }
}

describe("test", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    browser: true,
    nuxtConfig: {
      mail: {
        smtp: { port: 7777 },
      },
    },
  });

  let page: Awaited<ReturnType<typeof createPage>>;

  beforeAll(async () => {
    page = await createPage("/");
    console.log(await page.content());
  });

  beforeEach(async () => {
    mailServer.removeAll();
  });

  it("bcc", async () => {
    await page.locator("#mail-bcc").click();

    const capture = await mailServer.captureOne("johndoe@gmail.com", { wait: 3000 });

    expect(capture.email.body).toEqual("This is an incredible test message");
    expect(capture.email.headers.subject).toEqual("Incredible");
    expect(capture.email.headers.from).toEqual("a@b.de");
    expect(capture.email.receivers).toEqual({ "johndoe@gmail.com": true });
  });

  it("cc", async () => {
    await page.locator("#mail-cc").click();

    const capture = await mailServer.captureOne("johndoe@gmail.com", { wait: 3000 });

    expect(capture.email.body).toEqual("This is an incredible test message");
    expect(capture.email.headers.subject).toEqual("Incredible");
    expect(capture.email.headers.from).toEqual("a@b.de");
    expect(capture.email.headers.cc).toEqual("johndoe@gmail.com");
    expect(capture.email.receivers).toEqual({ "johndoe@gmail.com": true });
  });

  it("cc and bcc", async () => {
    await page.locator("#mail-cc-bcc").click();

    const capture = await mailServer.captureOne("cc@gmail.com", { wait: 3000 });

    expect(capture.email.body).toEqual("This is an incredible test message");
    expect(capture.email.headers.subject).toEqual("Incredible");
    expect(capture.email.headers.from).toEqual("a@b.de");
    expect(capture.email.headers.cc).toEqual("cc@gmail.com");

    expect(capture.email.receivers).toEqual({
      "bcc@gmail.com": true,
      "cc@gmail.com": true,
    });
  });

  it("config by index", async () => {
    await page.locator("#mail-index").click();

    const capture = await mailServer.captureOne("johndoe@gmail.com", { wait: 3000 });

    expect(capture.email.body).toEqual("This is an incredible test message");
    expect(capture.email.headers.subject).toEqual("Incredible");
    expect(capture.email.headers.from).toEqual("a@b.de");
    expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
  });

  it("send with injected `$mail`", async () => {
    await page.locator("#mail-injected-to").click();

    const capture = await mailServer.captureOne("johndoe@gmail.com", { wait: 3000 });

    expect(capture.email.body).toEqual("This is an incredible test message");
    expect(capture.email.headers.subject).toEqual("Incredible");
    expect(capture.email.headers.from).toEqual("a@b.de");
    expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
  });

  it("invalid config index", async () => {
    const messages: string[] = [];
    page.on("console", (msg) => messages.push(msg.text()));

    await page.locator("#mail-bad-index").click();
    // await new Promise((res) => setTimeout(res, 1000));

    expect(messages.join("\n")).toContain("Message config not found at index 9999.");
  });

  it("invalid config name", async () => {
    const messages: string[] = [];
    page.on("console", (msg) => messages.push(msg.text()));

    await page.locator("#mail-bad-name").click();
    // await new Promise((res) => setTimeout(res, 1000));

    expect(messages.join("\n")).toContain("Message config with name 'does-not-exist' not found.");
  });
});

// test("no message configs", async () => {
//   await fs.outputFile(
//     "nuxt.config.js",
//     `
//         export default {
//           modules: [
//             ['../src/index.js', { smtp: {} }],
//           ],
//         }
//       `
//   );

//   await expect(execaCommand("nuxt build")).rejects.toThrow("You have to provide at least one config.");
// });

// test("no recipients", async () => {
//   await fs.outputFile(
//     "nuxt.config.js",
//     `
//         export default {
//           modules: [
//             ['../src/index.js', { message: {}, smtp: {} }],
//           ],
//         }
//       `
//   );

//   await expect(execaCommand("nuxt build")).rejects.toThrow("You have to provide to/cc/bcc in all configs.");
// });

// test("no smtp config", async () => {
//   await fs.outputFile(
//     "nuxt.config.js",
//     `
//         export default {
//           modules: ['../src/index.js'],
//         }
//       `
//   );

//   await expect(execaCommand("nuxt build")).rejects.toThrow("SMTP config is missing.");
// });
