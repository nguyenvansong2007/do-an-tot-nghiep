<template>
  <FormCheckbox
    v-model="newsletterConsent"
    name="newsletter"
    label="Đăng ký nhận tin tức mới nhất của chúng tôi"
    class="text-body-2xs"
  />
</template>

<script setup lang="ts">
const newsletterConsent = ref<true | undefined>(undefined)
</script>
