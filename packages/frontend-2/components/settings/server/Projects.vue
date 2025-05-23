<template>
  <section>
    <div class="md:max-w-5xl md:mx-auto pb-6 md:pb-0">
      <SettingsSectionHeader title="Dự án" text="Quản lý dự án của bạn" />
      <SettingsSharedProjects
        v-model:search="search"
        :projects="projects"
        @close="$emit('close')"
      />
      <InfiniteLoading
        v-if="projects?.length"
        :settings="{ identifier }"
        class="py-4"
        @infinite="onInfiniteLoad"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProjectsQuery } from '~~/lib/server-management/graphql/queries'
import { usePaginatedQuery } from '~/lib/common/composables/graphql'
import { graphql } from '~/lib/common/generated/gql'

graphql(`
  fragment SettingsServerProjects_ProjectCollection on ProjectCollection {
    totalCount
    items {
      ...SettingsSharedProjects_Project
    }
  }
`)
defineEmits<{
  (e: 'close'): void
}>()

const search = ref('')

const {
  identifier,
  onInfiniteLoad,
  query: { result }
} = usePaginatedQuery({
  query: getProjectsQuery,
  baseVariables: computed(() => ({
    query: search.value?.length ? search.value : null,
    limit: 50
  })),
  resolveKey: (vars) => [vars.query || ''],
  resolveCurrentResult: (res) => res?.admin.projectList,
  resolveNextPageVariables: (baseVars, cursor) => ({
    ...baseVars,
    cursor
  }),
  resolveCursorFromVariables: (vars) => vars.cursor
})

const projects = computed(() => result.value?.admin.projectList.items || [])
</script>
