<template>
  <ProjectPageSettingsBlock
    background
    title="Thảo luận"
    :disabled-message="disabled ? 'Bạn phải là chủ sở hữu dự án' : undefined"
  >
    <template #introduction>
      <p class="text-body-xs text-foreground">
        Kiểm soát những ai có thể để lại bình luận về dự án này.
      </p>
    </template>
    <FormRadioGroup
      v-model="selectedOption"
      :disabled="isDisabled"
      :options="radioOptions"
      @update:model-value="emitUpdate"
    />
  </ProjectPageSettingsBlock>
</template>

<script setup lang="ts">
import { UserGroupIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { FormRadioGroup } from '@speckle/ui-components'
import { ProjectVisibility } from '~/lib/common/generated/gql/graphql'
import { graphql } from '~~/lib/common/generated/gql'
import type { ProjectPageSettingsGeneralBlockDiscussions_ProjectFragment } from '~~/lib/common/generated/gql/graphql'

graphql(`
  fragment ProjectPageSettingsGeneralBlockDiscussions_Project on Project {
    id
    visibility
    allowPublicComments
  }
`)

const props = defineProps<{
  project: ProjectPageSettingsGeneralBlockDiscussions_ProjectFragment
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update-comments-permission', value: boolean): void
}>()

enum CommentPermission {
  Anyone = 'anyone',
  TeamMembers = 'teamMembers'
}

const selectedOption = ref(
  props.project.allowPublicComments
    ? CommentPermission.Anyone
    : CommentPermission.TeamMembers
)

const isDisabled = computed(
  () => props.project.visibility === ProjectVisibility.Private || props.disabled
)

const radioOptions = computed(() => [
  {
    value: CommentPermission.Anyone,
    title: 'Mọi người',
    introduction: 'Mọi người đều có thể bình luận',
    icon: UserGroupIcon
  },
  {
    value: CommentPermission.TeamMembers,
    title: 'Cộng tác viên',
    introduction: 'Chỉ cộng tác viên có thể bình luận',
    icon: UserCircleIcon,
    help:
      props.project.visibility === ProjectVisibility.Private
        ? 'Chỉ những người cộng tác mới có thể bình luận về các dự án riêng tư'
        : undefined
  }
])

watch(
  () => props.project.visibility,
  (newVisibility) => {
    if (newVisibility === ProjectVisibility.Private) {
      selectedOption.value = CommentPermission.TeamMembers
    }
  },
  { immediate: true }
)

const emitUpdate = (value: CommentPermission) => {
  emit('update-comments-permission', value === CommentPermission.Anyone)
}
</script>
