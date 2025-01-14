import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/components",
      name: "components",
      component: () => import("../views/components.vue"),
    },
    {
      path: "/home",
      name: "homepage",
      component: () => import("../views/homepage.vue"),
    },
    {
      path: "/workout",
      name: "workout",
      component: () => import("../views/workout.vue"),
    },
  ],
});

export default router;
