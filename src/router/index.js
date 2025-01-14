import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/components',
      name: 'components',
      component: () => import('../views/components.vue')
    },
    {
      path: '/home',
      name: 'homepage',
      component: () => import('../views/homepage.vue')
    },
    {
      path: '/workout',
      name: 'workout',
      component: () => import('../views/workout.vue')
    },
    {
      path: '/profile/settings',
      name: 'profile/settings',
      component: () => import('../views/profile-settings.vue')
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/search.vue"),
    },
  ],
});

export default router;
