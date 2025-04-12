<template>
  <div class="flex flex-col gap-4">
    <ProjectPageSettingsBlock
      background
      title="Thông tin dự án"
      :disabled-message="disabled ? 'You must be a project owner' : undefined"
    >
      <FormTextInput
        v-model="localProjectName"
        name="projectName"
        label="Tên dự án"
        placeholder="Tên dự án"
        show-label
        color="foundation"
        class="mb-2"
        :disabled="disabled"
      />
      <FormTextArea
        v-model="localProjectDescription"
        name="projectDescription"
        label="Mô tả dự án"
        placeholder="Mô tả"
        show-label
        show-optional
        color="foundation"
        :disabled="disabled"
      />
      <template #bottom-buttons>
        <FormButton color="subtle" :disabled="!hasChanges" @click="resetLocalState">
          Huỷ
        </FormButton>
        <FormButton :disabled="!hasChanges" @click="emitUpdate">Cập nhật</FormButton>
      </template>
    </ProjectPageSettingsBlock>

    <LayoutDialog
      v-model:open="showConfirmDialog"
      max-width="md"
      :buttons="dialogButtons"
    >
      <template #header>Chưa lưu thay đổi</template>
      <div class="space-y-4">
        <p>
          Bạn có những thay đổi chưa lưu. Bạn có muốn lưu chúng trước khi rời đi không?
        </p>
      </div>
    </LayoutDialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import {
  FormTextInput,
  FormTextArea,
  FormButton,
  LayoutDialog,
  type LayoutDialogButton
} from '@speckle/ui-components'
import type { ProjectPageSettingsGeneralBlockProjectInfo_ProjectFragment } from '~~/lib/common/generated/gql/graphql'
import type { RouteLocationRaw } from 'vue-router'
import { graphql } from '~~/lib/common/generated/gql'

graphql(`
  fragment ProjectPageSettingsGeneralBlockProjectInfo_Project on Project {
    id
    role
    name
    description
  }
`)

const props = defineProps<{
  project: ProjectPageSettingsGeneralBlockProjectInfo_ProjectFragment
  disabled?: boolean
}>()

const emit = defineEmits(['update-project'])
const router = useRouter()

const targetRoute = ref<RouteLocationRaw | undefined>(undefined)
const localProjectName = ref(props.project.name)
const localProjectDescription = ref(props.project.description ?? '')
const showConfirmDialog = ref(false)

const hasChanges = computed(() => {
  return (
    localProjectName.value !== props.project.name ||
    localProjectDescription.value !== props.project.description
  )
})

const emitUpdate = () => {
  emit('update-project', {
    name: localProjectName.value,
    description: localProjectDescription.value,
    onComplete: handleRedirection
  })
}

const handleRedirection = () => {
  showConfirmDialog.value = false
  resetLocalState()
  if (targetRoute.value) {
    router.push(targetRoute.value)
    targetRoute.value = undefined
  }
}

const resetLocalState = () => {
  localProjectName.value = props.project.name
  localProjectDescription.value = props.project.description ?? ''
  showConfirmDialog.value = false
}

const dialogButtons = computed<LayoutDialogButton[]>(() => [
  {
    text: 'Discard Changes',
    props: { color: 'outline' },
    onClick: handleRedirection
  },
  {
    text: 'Save Changes',
    props: {
      submit: true
    },
    onClick: () => {
      showConfirmDialog.value = false
      emitUpdate()
    }
  }
])

watch(
  () => props.project,
  (newProject, oldProject) => {
    if (newProject.name !== oldProject.name) {
      localProjectName.value = newProject.name
    }
    if (newProject.description !== oldProject.description) {
      localProjectDescription.value = newProject.description ?? ''
    }
  },
  { deep: true }
)

onBeforeRouteLeave((to, from, next) => {
  if (hasChanges.value && !showConfirmDialog.value) {
    targetRoute.value = to
    showConfirmDialog.value = true
    next(false)
  } else {
    next()
  }
})
</script>
