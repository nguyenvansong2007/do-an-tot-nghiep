<template>
  <div>
    <ViewerPostSetupWrapper>
      <div class="flex-1">
        <!-- Nav -->
        <Portal to="navigation">
          <ViewerScope :state="state">
            <template v-if="project?.workspace && isWorkspacesEnabled">
              <HeaderNavLink
                :to="workspaceRoute(project?.workspace.slug)"
                :name="project?.workspace.name"
                :separator="false"
              ></HeaderNavLink>
            </template>
            <HeaderNavLink
              v-else
              :to="projectsRoute"
              name="Projects"
              :separator="false"
            ></HeaderNavLink>
            <HeaderNavLink
              :to="`/projects/${project?.id}`"
              :name="project?.name"
            ></HeaderNavLink>
            <ViewerExplorerNavbarLink />
          </ViewerScope>
        </Portal>

        <ClientOnly>
          <!-- Tour host -->
          <div
            v-if="showTour"
            class="fixed w-full h-[100dvh] flex justify-center items-center pointer-events-none z-[100]"
          >
            <TourOnboarding @complete="showTour = false" />
          </div>
          <!-- Viewer host -->
          <div
            class="viewer special-gradient absolute z-10 overflow-hidden w-screen"
            :class="
              isEmbedEnabled
                ? isTransparent
                  ? 'viewer-transparent h-[100dvh]'
                  : 'h-[calc(100dvh-3.5rem)]'
                : 'h-[100dvh]'
            "
          >
            <ViewerBase />
            <Transition
              enter-from-class="opacity-0"
              enter-active-class="transition duration-1000"
            >
              <ViewerAnchoredPoints v-show="showControls" />
            </Transition>
          </div>

          <!-- Global loading bar -->
          <ViewerLoadingBar class="absolute -top-2 left-0 w-full z-40" />

          <!-- Sidebar controls -->
          <Transition
            enter-from-class="opacity-0"
            enter-active-class="transition duration-1000"
          >
            <ViewerControls v-show="showControls" class="relative z-20" />
          </Transition>

          <!-- Viewer Object Selection Info Display -->
          <Transition
            v-if="!hideSelectionInfo"
            enter-from-class="opacity-0"
            enter-active-class="transition duration-1000"
          >
            <div v-show="showControls">
              <ViewerSelectionSidebar class="z-20" />
            </div>
          </Transition>
          <div
            class="absolute z-10 w-screen px-8 grid grid-cols-1 sm:grid-cols-3 gap-2"
            :class="isEmbedEnabled ? 'bottom-16 mb-1' : 'bottom-6'"
          >
            <div class="flex items-end justify-center sm:justify-start">
              <PortalTarget name="pocket-left"></PortalTarget>
            </div>
            <div class="flex flex-col gap-2 items-center justify-end">
              <PortalTarget name="pocket-tip"></PortalTarget>
              <div class="flex gap-3">
                <PortalTarget name="pocket-actions"></PortalTarget>
                <!-- Shows up when filters are applied for an easy return to normality -->
                <ViewerGlobalFilterReset
                  v-if="hasAnyFiltersApplied"
                  class="z-20"
                  :embed="!!isEmbedEnabled"
                />
              </div>
            </div>
            <div class="flex items-end justify-center sm:justify-end">
              <PortalTarget name="pocket-right"></PortalTarget>
            </div>
          </div>
        </ClientOnly>
      </div>
    </ViewerPostSetupWrapper>
    <ViewerEmbedFooter
      :name="modelName || 'Loading...'"
      :date="lastUpdate"
      :url="route.path"
    />
    <Portal to="primary-actions">
      <HeaderNavShare v-if="project" :resource-id-string="modelId" :project="project" />
    </Portal>
  </div>
</template>
<script setup lang="ts">
import {
  useSetupViewer,
  type InjectableViewerState
} from '~~/lib/viewer/composables/setup'
import dayjs from 'dayjs'
import { graphql } from '~~/lib/common/generated/gql'
import { useEmbed } from '~/lib/viewer/composables/setup/embed'
import { useViewerTour } from '~/lib/viewer/composables/tour'
import { useFilterUtilities } from '~/lib/viewer/composables/ui'
import { projectsRoute } from '~~/lib/common/helpers/route'
import { workspaceRoute } from '~/lib/common/helpers/route'

const emit = defineEmits<{
  setup: [InjectableViewerState]
}>()

const route = useRoute()
const { showTour, showControls } = useViewerTour()
const isWorkspacesEnabled = useIsWorkspacesEnabled()

const modelId = computed(() => route.params.modelId as string)

const projectId = computed(() => route.params.id as string)

const state = useSetupViewer({
  projectId
})
const {
  filters: { hasAnyFiltersApplied }
} = useFilterUtilities({ state })
const { isEnabled: isEmbedEnabled, hideSelectionInfo, isTransparent } = useEmbed()

emit('setup', state)

const {
  resources: {
    response: { project }
  }
} = state

graphql(`
  fragment ModelPageProject on Project {
    id
    createdAt
    name
    visibility
    workspace {
      id
      slug
      name
    }
  }
`)

const title = computed(() => {
  if (project.value?.models?.items) {
    const modelCount = project.value.models.items.length
    const projectName = project.value.name || ''

    if (modelCount > 1) {
      return projectName ? `Multiple models - ${projectName}` : 'Multiple models'
    } else if (modelCount === 1) {
      const modelName = project.value.models.items[0].name || ''
      return projectName ? `${modelName} - ${projectName}` : modelName
    }
  }
  return ''
})

const modelName = computed(() => {
  if (project.value?.models?.items && project.value.models.items.length > 0) {
    return project.value.models.items[0].name
  } else {
    return project.value?.name
  }
})

const lastUpdate = computed(() => {
  if (project.value?.models?.items[0] && project.value.models.items[0].updatedAt) {
    return 'Đã cập nhật ' + dayjs(project.value.models.items[0].updatedAt).fromNow()
  } else if (project.value) {
    return 'Đã tạo ' + dayjs(project.value.createdAt).fromNow()
  } else return undefined
})

useHead({ title })
</script>
