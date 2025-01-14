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
      name: "workoutpage",
      component: () => import("../views/workoutpage.vue"),
    },
    {
      path: "/workoutactive",
      name: "workoutactive",
      component: () => import("../views/workoutactive.vue"),
    },
  ],
});

export default router;
