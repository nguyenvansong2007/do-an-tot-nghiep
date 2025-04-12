<template>
  <ProjectPageSettingsBlock
    background
    title="Truy cập"
    :disabled-message="disabled ? 'You must be a project owner' : undefined"
  >
    <template #introduction>
      <p class="text-body-xs text-foreground">
        Chọn cách bạn muốn chia sẻ dự án này với người khác.
      </p>
    </template>
    <FormRadioGroup
      v-model="selectedOption"
      :options="radioOptions"
      :disabled="disabled"
      @update:model-value="emitUpdate"
    />
  </ProjectPageSettingsBlock>
</template>

<script setup lang="ts">
import { LockClosedIcon, LinkIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import { FormRadioGroup } from '@speckle/ui-components'
import { ProjectVisibility } from '~/lib/common/generated/gql/graphql'
import { graphql } from '~~/lib/common/generated/gql'
import type { ProjectPageSettingsGeneralBlockAccess_ProjectFragment } from '~~/lib/common/generated/gql/graphql'

graphql(`
  fragment ProjectPageSettingsGeneralBlockAccess_Project on Project {
    id
    visibility
  }
`)

const props = defineProps<{
  project: ProjectPageSettingsGeneralBlockAccess_ProjectFragment
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-visibility', v: ProjectVisibility): void
}>()

const selectedOption = ref(props.project.visibility || ProjectVisibility.Private)

const radioOptions = computed(() => [
  {
    value: ProjectVisibility.Public,
    title: 'Công khai',
    introduction: 'Dự án hiển thị cho mọi người',
    icon: GlobeAltIcon
  },
  {
    value: ProjectVisibility.Unlisted,
    title: 'Chia sẻ qua liên kết',
    introduction: 'Bất kỳ ai có liên kết đều có thể xem',
    icon: LinkIcon
  },
  {
    value: ProjectVisibility.Private,
    title: 'Riêng tư',
    introduction: 'Chỉ cộng tác viên mới có thể truy cập',
    icon: LockClosedIcon
  }
])

watch(
  () => props.project.visibility,
  (newVal) => {
    selectedOption.value = newVal ?? ProjectVisibility.Private
  }
)

const emitUpdate = (value: ProjectVisibility) => {
  emit('update-visibility', value)
}
</script>
