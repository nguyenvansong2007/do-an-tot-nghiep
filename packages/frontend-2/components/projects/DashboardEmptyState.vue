<template>
  <div class="flex justify-center flex-col text-center my-12">
    <h2 class="text-heading mt-2 text-foreground">
      {{ isGuest ? 'No projects found' : 'Tạo dự án đầu tiên của bạn' }}
    </h2>
    <h4 class="text-body-xs mb-4 mt-2 max-w-xs mx-auto text-foreground-2">
      Dự án là nơi lưu trữ mô hình và phiên bản của bạn.
    </h4>
    <div class="flex flex-col items-center gap-2">
      <FormButton
        v-if="!isGuest"
        color="outline"
        class="shadow-lg"
        @click="$emit('create-project')"
      >
        Tạo dự án
      </FormButton>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  isGuest: boolean
}>()

defineEmits(['create-project'])
</script>
