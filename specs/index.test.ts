import { afterAll, afterEach, beforeEach, it, describe, expect, beforeAll } from "vitest";
import { $fetch, createPage, setup, startServer } from "@nuxt/test-utils/e2e";
import { fileURLToPath } from "node:url";
import * as smtpTester from "smtp-tester";
// import { consola } from "consola";

let mailServer: smtpTester.MailServer;
beforeAll(async () => {
  mailServer = smtpTester.init(7777);
});

beforeEach(async () => {
  // browser = await puppeteer.launch();
  // page = await browser.newPage();
  (await import("consola")).default.restoreConsole();
});

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
});

// test("client side", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', { message: { to: 'johndoe@gmail.com' }, smtp: { port: 3001 } }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <button @click="send" />
//         </template>

//         <script setup>
//         const mail = useMail()

//         const send = mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//           to: 'foo@bar.de',
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();
//     await page.goto("http://localhost:3000");
//     const button = await page.waitForSelector("button");

//     const [capture] = await Promise.all([mailServer.captureOne("johndoe@gmail.com"), button.click()]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("config by index", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: [{ to: 'foo@bar.com' }, { to: 'johndoe@gmail.com' }],
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const mail = useMail()

//         await mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//           config: 1,
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();

//     const [capture] = await Promise.all([
//       mailServer.captureOne("johndoe@gmail.com"),
//       page.goto("http://localhost:3000"),
//     ]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("config by name", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: [
//                 { to: 'foo@bar.com' },
//                 { name: 'foo', to: 'johndoe@gmail.com' },
//               ],
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const mail = useMail()

//         await mail.send({
//           config: 'foo',
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();

//     const [capture] = await Promise.all([
//       mailServer.captureOne("johndoe@gmail.com"),
//       page.goto("http://localhost:3000"),
//     ]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("config invalid index", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: [{ to: 'foo@bar.com' }],
//               smtp: {},
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <script setup>
//         const mail = useMail()

//         await mail.send({ config: 10 })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();
//     let errorMessage;

//     try {
//       await fetch("http://localhost:3000", { method: "POST" });
//     } catch (error: unknown) {
//       errorMessage = error.response.data.message;
//     }

//     expect(errorMessage).toEqual("Message config not found at index 10.");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("config name not found", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', { message: [{ to: 'foo@bar.com' }], smtp: {} }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <script setup>
//         const mail = useMail()

//         await mail.send({ config: 'foo' })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();
//     let errorMessage;

//     try {
//       await axios.post("http://localhost:3000");
//     } catch (error) {
//       errorMessage = error.response.data.message;
//     }

//     expect(errorMessage).toEqual("Message config with name 'foo' not found.");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("injected", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: { to: 'johndoe@gmail.com' },
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const { $mail } = useNuxtApp()

//         await $mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//           to: 'foo@bar.de',
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();

//     const [capture] = await Promise.all([
//       mailServer.captureOne("johndoe@gmail.com"),
//       page.goto("http://localhost:3000"),
//     ]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

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

// test("prod", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: { to: 'johndoe@gmail.com' },
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const mail = useMail()

//         await mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//           to: 'foo@bar.de',
//         })
//         </script>
//       `,
//   });

//   await execaCommand("nuxt build");
//   const nuxt = execaCommand("nuxt start");

//   try {
//     await portReady(3000);

//     const [capture] = await Promise.all([
//       mailServer.captureOne("johndoe@gmail.com"),
//       page.goto("http://localhost:3000"),
//     ]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("to, cc and bcc", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: {
//                 bcc: 'bcc@gmail.com',
//                 cc: 'cc@gmail.com',
//                 to: 'to@gmail.com',
//               },
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const mail = useMail()

//         await mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();

//     const [capture] = await Promise.all([mailServer.captureOne("to@gmail.com"), page.goto("http://localhost:3000")]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("to@gmail.com");
//     expect(capture.email.headers.cc).toEqual("cc@gmail.com");

//     expect(capture.email.receivers).toEqual({
//       "bcc@gmail.com": true,
//       "cc@gmail.com": true,
//       "to@gmail.com": true,
//     });
//   } finally {
//     await kill(nuxt.pid);
//   }
// });

// test("valid", async () => {
//   await outputFiles({
//     "nuxt.config.js": `
//         export default {
//           modules: [
//             ['../src/index.js', {
//               message: { to: 'johndoe@gmail.com' },
//               smtp: { port: 3001 },
//             }],
//           ],
//         }
//       `,
//     "pages/index.vue": `
//         <template>
//           <div />
//         </template>

//         <script setup>
//         const mail = useMail()

//         await mail.send({
//           from: 'a@b.de',
//           subject: 'Incredible',
//           text: 'This is an incredible test message',
//           to: 'foo@bar.de',
//         })
//         </script>
//       `,
//   });

//   const nuxt = execaCommand("nuxt dev");

//   try {
//     await nuxtDevReady();

//     const [capture] = await Promise.all([
//       mailServer.captureOne("johndoe@gmail.com"),
//       page.goto("http://localhost:3000"),
//     ]);

//     expect(capture.email.body).toEqual("This is an incredible test message");
//     expect(capture.email.headers.subject).toEqual("Incredible");
//     expect(capture.email.headers.from).toEqual("a@b.de");
//     expect(capture.email.headers.to).toEqual("johndoe@gmail.com");
//   } finally {
//     await kill(nuxt.pid);
//   }
// });
