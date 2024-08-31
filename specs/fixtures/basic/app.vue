<script setup lang="ts">
import type { GeneratedTypeConfig } from "@goede/nuxt-mail";

const mail = useMail();

function sendMailWithConfig(configName: GeneratedTypeConfig["configNames"]) {
  mail.send({
    config: configName,
    from: "a@b.de",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
}

function sendMailWithInjected(configName: GeneratedTypeConfig["configNames"]) {
  useNuxtApp().$mail.send({
    config: configName,
    from: "a@b.de",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
}
</script>

<template>
  <div>
    <button id="mail-index" @click="sendMailWithConfig(0)">index</button>
    <button id="mail-cc" @click="sendMailWithConfig('cc')">bcc</button>
    <button id="mail-bcc" @click="sendMailWithConfig('bcc')">bcc</button>
    <button id="mail-cc-bcc" @click="sendMailWithConfig('cc-bcc')">bcc</button>

    <button id="mail-injected-to" @click="sendMailWithInjected('to')">to (injected)</button>

    <button id="mail-bad-name" @click="sendMailWithConfig('does-not-exist')">invalid index</button>
    <button id="mail-bad-index" @click="sendMailWithConfig(9999)">invalid index</button>
  </div>
</template>
