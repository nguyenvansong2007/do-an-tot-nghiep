<template>
  <div>
    <ProjectPageSettingsBlock background title="Xoá dự án">
      <div
        class="rounded border bg-foundation-page border-outline-3 text-body-xs text-foreground py-4 px-6"
      >
        Xóa vĩnh viễn dự án này và tất cả nội dung của nó khỏi nền tảng BIMCDE. Hành động này không thể hoàn tác.
      </div>
      <template #bottom-buttons>
        <FormButton color="danger" @click="showDeleteDialog = true">
          Xoá dự án
        </FormButton>
      </template>
    </ProjectPageSettingsBlock>
    <ProjectPageSettingsGeneralBlockDeleteDialog
      v-if="project"
      v-model:open="showDeleteDialog"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import { graphql } from '~~/lib/common/generated/gql'
import type { ProjectPageSettingsGeneralBlockDelete_ProjectFragment } from '~~/lib/common/generated/gql/graphql'

graphql(`
  fragment ProjectPageSettingsGeneralBlockDelete_Project on Project {
    id
    name
    role
    models(limit: 0) {
      totalCount
    }
    commentThreads(limit: 0) {
      totalCount
    }
    workspace {
      slug
    }
  }
`)

defineProps<{
  project?: ProjectPageSettingsGeneralBlockDelete_ProjectFragment
}>()

const showDeleteDialog = ref(false)
</script>
