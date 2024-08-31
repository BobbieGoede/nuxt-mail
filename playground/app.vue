<script setup lang="ts">
const mail = useMail();
// or
// const mail = useNuxtApp().$mail

function onSendButton() {
  mail.send({
    config: "config-1",
    from: "John Doe",
    subject: "Incredible",
    text: "This is an incredible test message",
  });
}
</script>

<template>
  <div>Press the send button to trigger `onSendButton` <button @click="onSendButton">Send</button></div>
</template>
