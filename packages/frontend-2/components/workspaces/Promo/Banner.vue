<template>
  <div
    class="relative w-full bg-foundation-page border border-outline-2 rounded-lg overflow-hidden p-12"
  >
    <div class="absolute inset-0">
      <img
        src="~~/assets/images/workspaces.png"
        alt="Introducing workspaces"
        class="absolute top-0 right-0 w-full sm:w-9/12 h-full object-cover hidden md:block dark:!hidden"
      />

      <img
        src="~~/assets/images/workspaces-dark.png"
        alt="Introducing workspaces"
        class="absolute top-0 right-0 w-full sm:w-9/12 h-full object-cover hidden dark:md:block"
      />

      <div
        class="absolute top-0 right-0 h-full w-7/12 bg-gradient-to-r from-foundation-page"
      >
        <div class="h-full w-64 bg-gradient-to-r from-foundation-page" />
      </div>
    </div>

    <div class="relative z-10 text-foreground max-w-sm lg:max-w-md xl:max-w-lg">
      <div class="flex gap-2 items-center">
        <h3 class="text-heading-lg">Giới thiệu workspaces</h3>
      </div>
      <p class="text-body-sm mt-4">
        Bạn chỉ cần một cú nhấp chuột để quản lý dự án tốt hơn với nhóm của mình. Nhận
        không gian làm việc của bạn ngay hôm nay!
      </p>
      <div class="flex mt-6 gap-2">
        <FormButton color="outline" @click="$emit('create')">Tạo workspace</FormButton>
        <!-- <FormButton color="subtle">Learn more</FormButton> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineEmits<{
  (e: 'create'): void
}>()
</script>
