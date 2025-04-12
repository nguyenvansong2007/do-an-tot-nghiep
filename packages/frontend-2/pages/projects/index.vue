<template>
  <div>
    <Portal to="navigation">
      <HeaderNavLink :to="projectsRoute" name="Dự án" :separator="false" />
    </Portal>
    <ProjectsDashboard v-if="isLoggedIn" />
    <div v-else class="mx-auto">
      <CommonLoadingIcon />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useActiveUser } from '~~/lib/auth/composables/activeUser'
import { projectsRoute } from '~/lib/common/helpers/route'

useHead({
  title: 'Dự án'
})

definePageMeta({
  middleware: ['auth']
})

const { isLoggedIn } = useActiveUser()
</script>
