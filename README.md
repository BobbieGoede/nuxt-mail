<!-- TITLE/ -->

# ✉️ Nuxt Mail

<!-- /TITLE -->

<!-- BADGES/ -->
<p>
  <a href="https://npmjs.org/package/@goede/nuxt-mail">
    <img
      src="https://img.shields.io/npm/v/@goede/nuxt-mail.svg"
      alt="npm version"
    >
  </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->

> This a full rewrite of [`nuxt-mail`](https://github.com/dword-design/nuxt-mail) using typescript, `@nuxt/module-builder` and supports Nuxt `>=3.0.0` only.

- 📨 Send emails using `useNuxtApp().$mail` or the `useMail()` composable
- ⚙️ Generated types based on configuration for type inference
- 📫 Uses `nodemailer` from within a server route

<!-- /DESCRIPTION -->

> [!WARNING]
> This module does not work for statically generated sites (SSG) as it relies on server routes to communicate with the SMTP server.

<!-- INSTALL/ -->

## Install

```bash
$ npx nuxi module add @goede/nuxt-mail
```

<!-- /INSTALL -->

## Configuration

Add the module to the `modules` array in your `nuxt.config.ts`.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      "@goede/nuxt-mail",
      {
        message: {
          to: "foo@bar.nl",
        },
        smtp: {
          host: "smtp.example.com",
          port: 587,
        },
      },
    ],
  ],
  // or use the top-level option:
  mail: {
    message: {
      to: "foo@bar.nl",
    },
    smtp: {
      host: "smtp.example.com",
      port: 587,
    },
  },
});
```

> [!WARNING]
> For security reasons a message configuration is required to set a `to`, `cc` or `bcc` property. This prevents sending out mails to arbitrary recipients from the client-side, only to those preconfigured.

The `smtp` options are required and directly passed to [nodemailer](https://nodemailer.com/smtp/). Refer to their documentation for available options.

Besides setting the recipient fields, you can preconfigure other message fields in the `message` config to send emails with the common values (such as `subject`, `from`, etc.).

## Usage

### Via composable

```html
<script setup>
  const mail = useMail();

  mail.send({
    from: "John Doe",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
</script>
```

### Via injected variable

```html
<script setup>
  const { $mail } = useNuxtApp();

  $mail.send({
    from: "John Doe",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
</script>
```

### Via Options API

```html
<script lang="ts">
  export default defineNuxtcomponent({
    methods: {
      sendEmail() {
        this.$mail.send({
          from: "John Doe",
          subject: "Incredible",
          text: "This is an incredible test message",
        });
      },
    },
  });
</script>
```

## Multiple message configs

Multiple message configurations can be set by changing the `message` config into an array.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      "@goede/nuxt-mail",
      {
        message: [
          { name: "contact", to: "contact@foo.nl" },
          { name: "support", to: "support@foo.nl" },
        ],
        // ...
      },
    ],
  ],
});
```

These configurations can be used by passing `config` property that corresponds with the config `name`. These names will autocomplete using types generated on startup.

```ts
mail.send({
  config: "support",
  from: "John Doe",
  subject: "Incredible",
  text: "This is an incredible test message",
});
```

For legacy purposes we support passing the config index instead of the config name.

> [!NOTE]
> This will be removed in v2 as the config name is now typesafe.

```ts
mail.send({
  config: 1, // Resolves to 'support'
  from: "John Doe",
  subject: "Incredible",
  text: "This is an incredible test message",
});
```

## Setting up popular email services

### Gmail

You have to setup an [app-specific password](https://myaccount.google.com/apppasswords) to log into the SMTP server. Then, add the following config to your `nuxt-mail` config. Looks like there are multiple ways to configure Gmail, so it's best to try out the options:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      "@goede/nuxt-mail",
      {
        smtp: {
          service: "gmail",
          auth: {
            user: "foo@gmail.com",
            pass: "<app-specific password>",
          },
        },
      },
    ],
  ],
});
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      "nuxt-mail",
      {
        smtp: {
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "foo@gmail.com",
            pass: "<app-specific password>",
          },
        },
      },
    ],
  ],
});
```

Missing something? Add your service here via a [pull request](https://github.com/BobbieGoede/nuxt-mail/pulls).

## Debugging mail errors

You can debug errors using the browser developer tools, if a `500` error is thrown (check out the console output), you can find the error message in the Network tab. For Chrome users, open the Network tab and look for the "send" request. Open it and select the "Response" tab, this should show the error message, in most cases the error is related to authentication with the SMTP server.

## Open questions

### "Self signed certificate in certificate chain" error

There is [an open issue](https://github.com/dword-design/nuxt-mail/issues/62) where the above error is thrown, if you know what could be causing this or have a solution for this please join the issue discussion and let us know!

<!-- LICENSE/ -->

## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/BobbieGoede/nuxt-mail/issues) or a [pull request](https://github.com/BobbieGoede/nuxt-mail/pulls)! ⚙️

## License

[MIT License](https://opensource.org/license/mit/) © [Bobbie Goede](https://github.com/BobbieGoede) & [Sebastian Landwehr](https://sebastianlandwehr.com)

<!-- /LICENSE -->
