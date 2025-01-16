import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/components',
      name: 'components',
      component: () => import('../views/components.vue'),
    },
    {
      path: '/home',
      name: 'homepage',
      component: () => import('../views/homepage.vue'),
    },
    {
      path: '/workout',
      name: 'workout',
      component: () => import('../views/workout.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/search.vue'),
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
      path: '/podium',
      name: 'podium',
      component: () => import('../views/podium.vue'),
    },
  ],
});

export default router;
