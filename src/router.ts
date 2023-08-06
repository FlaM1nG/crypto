import { createWebHistory, createRouter } from 'vue-router';

import Home from './views/Home.vue';
import Error from './views/Error.vue';
import About from './views/About.vue';
import CoinDetail from './views/CoinDetail.vue';

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/coin/:id(.*)",
    name: "coin-detail",
    component: CoinDetail,
  },
  {
    path: "/:catchAll(.*)",
    name: "error",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
