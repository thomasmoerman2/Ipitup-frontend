import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/components',
      name: 'components',
      component: () => import('../views/components.vue'),
    },
    {
      path: '/',
      name: 'homepage',
      component: () => import('../views/homepage.vue'),
    },
    {
      path: '/workout',
      name: 'workout',
      component: () => import('../views/workout.vue'),
    },
    {
      path: '/workout/active/:exercise',
      name: 'workoutactive',
      component: () => import('../views/workoutactive.vue'),
      meta: {
        hideNavigation: true
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/search.vue'),
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: () => import('../views/User.vue'),
      props: true,
    },
    {
      path: '/u/:username',
      redirect: to => {
        return { name: 'user', params: { id: to.params.username } }
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile.vue'),
    },
    {
      path: '/profile/settings',
      name: 'profile/settings',
      component: () => import('../views/profile-settings.vue'),
    },
    {
      path: '/profile/customize',
      name: 'profile/customize',
      component: () => import('../views/profile-customize.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {
        hideNavigation: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    },
    {
      path: '/podium',
      name: 'podium',
      component: () => import('../views/podium.vue'),
    }
  ],
});

export default router;
