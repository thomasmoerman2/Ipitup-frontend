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
    {
      path: "/search",
      name: "search",
      component: () => import("../views/search.vue"),
    },
    {
      path: "/searchProfile",
      name: "searchprofile",
      component: () => import("../views/searchProfile.vue"),
    },
  ],
});

export default router;
