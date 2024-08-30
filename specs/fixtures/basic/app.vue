<script setup lang="ts">
const mail = useMail();

function sendMailWithConfig(configName: string) {
  mail.send({
    config: configName,
    from: "a@b.de",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
}
</script>

<template>
  <div>
    <button id="mail-cc" @click="sendMailWithConfig('cc')">bcc</button>
    <button id="mail-bcc" @click="sendMailWithConfig('bcc')">bcc</button>
    <button id="mail-cc-bcc" @click="sendMailWithConfig('cc-bcc')">bcc</button>
  </div>
</template>
