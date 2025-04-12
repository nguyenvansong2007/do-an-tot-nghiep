import { LocalStorageKeys } from '@/helpers/mainConstants'
import { AppLocalStorage } from '@/utils/localStorage'
import { GlobalEvents } from '@/main/lib/core/helpers/eventHubHelper'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { getMixpanel } from '@/mixpanelManager'
import {
  deletePostAuthRedirect,
  getPostAuthRedirect,
  setPostAuthRedirect
} from '@/main/lib/auth/utils/postAuthRedirectManager'
import { reduce } from 'lodash'

Vue.use(VueRouter)

const routes = [
  {
    path: '/authn',
    name: 'Auth',
    redirect: '/authn/login',
    component: () => import('@/main/layouts/TheAuth.vue'),
    beforeEnter: (to, from, next) => {
      // If we're in an iframe, we should not render any auth routes.
      if (window.self !== window.top) {
        return next('/error')
      }
      next()
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        meta: {
          title: 'Đăng nhập | BIMCDE'
        },
        component: () => import('@/main/pages/auth/TheLogin.vue')
      },
      {
        path: 'register',
        name: 'Register',
        meta: {
          title: 'Đăng ký | BIMCDE'
        },
        component: () => import('@/main/pages/auth/TheRegistration.vue')
      },
      {
        path: 'resetpassword',
        name: 'Reset Password',
        meta: {
          title: 'Reset Password | BIMCDE'
        },
        component: () => import('@/main/pages/auth/ResetPasswordRequest.vue')
      },
      {
        path: 'resetpassword/finalize',
        name: 'Reset Password Finalization',
        meta: {
          title: 'Reset Password | BIMCDE'
        },
        component: () => import('@/main/pages/auth/ResetPasswordFinalization.vue')
      },
      {
        path: 'verify/:appId/:challenge',
        name: 'Authorize App',
        meta: {
          title: 'Authorizing App | BIMCDE'
        },
        component: () => import('@/main/pages/auth/AuthorizeApp.vue')
      }
    ]
  },
  {
    path: '/',
    meta: {
      title: 'Trang chủ | BIMCDE'
    },
    component: () => import('@/main/layouts/TheMain.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: 'Trang chủ | BIMCDE'
        },
        component: () => import('@/main/pages/TheFeed.vue')
      },
      {
        path: '/commits',
        name: 'commits',
        meta: {
          title: 'Commits | BIMCDE'
        },
        component: () => import('@/main/pages/TheCommits.vue')
      },
      {
        path: 'streams',
        name: 'streams',
        meta: {
          title: 'Streams | BIMCDE'
        },
        component: () => import('@/main/pages/TheStreams.vue')
      },
      {
        path: 'streams/favorite',
        name: 'favorite-streams',
        meta: {
          title: 'Favorite Streams | BIMCDE'
        },
        component: () => import('@/main/pages/TheFavoriteStreams.vue')
      },
      {
        path: 'streams/:streamId',
        meta: {
          title: 'Stream | BIMCDE'
        },
        component: () => import('@/main/pages/stream/TheStream.vue'),
        children: [
          {
            path: '',
            name: 'stream',
            meta: {
              title: 'Stream | BIMCDE'
            },
            component: () => import('@/main/pages/stream/TheStreamHome.vue')
          },
          {
            path: 'branches/',
            name: 'branches',
            redirect: 'branches/main'
          },
          {
            path: 'branches/:branchName*',
            name: 'branch',
            meta: {
              title: 'Branch | BIMCDE'
            },
            component: () => import('@/main/pages/stream/TheBranch.vue'),
            beforeEnter: (to, from, next) => {
              if (to.params.branchName.toLowerCase() !== to.params.branchName)
                return next(
                  `/streams/${to.params.streamId
                  }/branches/${to.params.branchName.toLowerCase()}`
                )
              else next()
            }
          },
          {
            path: 'comments/',
            name: 'comments',
            meta: {
              title: 'Stream Comments | BIMCDE',
              resizableNavbar: false
            },
            component: () => import('@/main/pages/stream/TheComments.vue')
          },
          {
            path: 'commits/:resourceId*',
            name: 'commit',
            meta: {
              title: 'Commit | BIMCDE',
              resizableNavbar: true,
              hideEmailBanner: true
            },
            component: () => import('@/main/pages/stream/CommitObjectViewer.vue'),
            props: (route) => ({
              streamId: route.params.streamId,
              resourceId: route.params.resourceId
            })
          },
          {
            path: 'objects/:resourceId*',
            name: 'objects',
            meta: {
              title: 'Object | BIMCDE',
              resizableNavbar: true,
              hideEmailBanner: true
            },
            component: () => import('@/main/pages/stream/CommitObjectViewer.vue'),
            props: (route) => ({
              streamId: route.params.streamId,
              resourceId: route.params.resourceId
            })
          },
          {
            path: 'collaborators/',
            name: 'collaborators',
            meta: {
              title: 'Stream Collaborators | BIMCDE'
            },
            props: true,
            component: () => import('@/main/pages/stream/TheCollaborators.vue')
          },
          {
            path: 'settings/',
            name: 'settings',
            meta: {
              title: 'Stream Settings | BIMCDE'
            },
            props: true,
            component: () => import('@/main/pages/stream/TheSettings.vue')
          },
          {
            path: 'webhooks/',
            name: 'webhooks',
            meta: {
              title: 'Webhooks | BIMCDE'
            },
            props: true,
            component: () => import('@/main/pages/stream/TheWebhooks.vue')
          },
          {
            path: 'uploads/',
            name: 'uploads',
            meta: {
              title: 'Stream Uploads | BIMCDE'
            },
            props: true,
            component: () => import('@/main/pages/stream/TheUploads.vue')
          },
          {
            path: 'globals/',
            name: 'globals',
            meta: {
              title: 'Globals | BIMCDE'
            },
            props: true,
            component: () => import('@/main/pages/stream/TheGlobals.vue')
          },
          {
            path: 'globals/:commitId',
            name: 'previous globals',
            meta: {
              title: 'Globals | BIMCDE'
            },
            component: () => import('@/main/pages/stream/TheGlobals.vue')
          }
        ]
      },
      {
        path: 'profile',
        name: 'profile',
        meta: {
          title: 'Hồ sơ của bạn | BIMCDE'
        },
        component: () => import('@/main/pages/user/TheProfileSelf.vue')
      },
      {
        path: 'profile/:userId',
        name: 'user profile',
        meta: {
          title: 'Hồ sơ người dùng | BIMCDE'
        },
        component: () => import('@/main/pages/user/TheProfileUser.vue')
      },
      {
        path: 'admin',
        meta: {
          title: 'Admin | Overview'
        },
        redirect: 'admin/dashboard',
        component: () => import('@/main/pages/admin/Admin.vue'),
        children: [
          {
            name: 'Admin | Overview',
            path: 'dashboard',
            component: () => import('@/main/pages/admin/Dashboard.vue')
          },
          {
            name: 'Admin | Users',
            path: 'users',
            component: () => import('@/main/pages/admin/Users.vue'),
            props: (route) => ({ ...route.query })
          },
          {
            name: 'Admin | Streams',
            path: 'streams',
            component: () => import('@/main/pages/admin/Streams.vue'),
            props: (route) => ({ ...route.query })
          },
          {
            name: 'Admin | Settings',
            path: 'settings',
            component: () => import('@/main/pages/admin/ServerSettings.vue')
          },
          {
            name: 'Admin | Invites',
            path: 'invites',
            component: () => import('@/main/pages/admin/Invites.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/error',
    name: 'Error',
    meta: {
      title: 'Error | BIMCDE'
    },
    component: () => import('@/main/pages/common/TheError.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding | BIMCDE',
    meta: {
      title: 'Getting Started | BIMCDE'
    },
    component: () => import('@/main/pages/onboarding/TheOnboarding.vue')
  },
  {
    path: '*',
    name: 'notfound',
    meta: {
      title: 'Not Found | BIMCDE'
    },
    component: () => import('@/main/pages/common/NotFound.vue')
  },
  {
    path: '/embed',
    meta: {
      title: 'Embed View | BIMCDE'
    },
    component: () => import('@/main/layouts/TheBasic.vue'),
    children: [
      {
        path: '/',
        name: 'viewer-embed',
        meta: {
          title: 'Embed View | BIMCDE'
        },
        component: () => import('@/main/pages/stream/TheEmbed.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

function shouldForceToLogin(isLoggedIn, to) {
  if (isLoggedIn) return false

  const allowedForUnauthedNames = [
    'stream',
    'branch',
    'commit',
    'objects',
    'Embedded Viewer',
    'Login',
    'Register',
    'Error',
    'Reset Password',
    'Reset Password Finalization',
    'viewer-embed'
  ]

  // Check if any of the new routes (nested or not) is one of the routes that is allowed for unauthed users
  // If it is - we shouldnt force a redirect
  const isAllowedRoute = to.matched.some(
    ({ name }) => name && allowedForUnauthedNames.includes(name)
  )
  return !isAllowedRoute
}

router.beforeEach((to, _from, next) => {
  const uuid = AppLocalStorage.get(LocalStorageKeys.Uuid)
  const redirect = getPostAuthRedirect()

  router.app.$eventHub.$emit(GlobalEvents.PageLoading, true)

  // Redirect to log in page if not authed and on private pages
  if (shouldForceToLogin(!!uuid, to)) {
    // Redirect back here afterwards, unless if there's an already pending redirect
    if (!redirect?.pathWithQuery) {
      // Ignore home page - its already the default redirect
      if (to.name !== 'home') {
        setPostAuthRedirect({ pathWithQuery: to.fullPath })
      }
    }

    return next({ name: 'Login' })
  }

  // Redirect to home if in one of the routes that are guest only
  if ((to.name === 'Login' || to.name === 'Register') && uuid) {
    return next({ name: 'home' })
  }

  // If we're logged in, we should redirect to the stored redirect path
  if (uuid && redirect && redirect?.pathWithQuery) {
    deletePostAuthRedirect()
    const redirectUrl = new URL(redirect.pathWithQuery, window.location.origin)
    return next({
      path: redirectUrl.pathname,
      query: reduce(
        [...redirectUrl.searchParams.entries()],
        (result, entry) => {
          result[entry[0]] = entry[1]
          return result
        },
        {}
      )
    })
  }

  return next()
})

//TODO: include stream name in page title eg `My Cool Stream | Speckle`
router.afterEach((to) => {
  router.app.$eventHub.$emit(GlobalEvents.PageLoading, false)

  Vue.nextTick(() => {
    document.title = (to.meta && to.meta.title) || 'BIMCDE'
  })

  // Report route to mixpanel
  const mp = getMixpanel()
  const pathDefinition = to.matched[to.matched.length - 1].path
  const path = to.path
  mp.track('Route Visited', {
    path,
    pathDefinition
  })
})

export default router
