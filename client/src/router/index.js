import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(), // Utilise l'historique du navigateur (URLs propres)
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/teams",
      name: "teams",
      // on utilise le lazy-loading (import dynamique) pour cette page
      component: () => import("../views/TeamsView.vue"),
      // Etape 1 : On marque cette route comme protégée
      meta: { requiresAuth: true }
    }
  ]
});

// Etape 2 : Le Garde de navigation (Navigation Guard)
// Cette fonction s'execute à chaque fois qu'on change d'URL
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // "to.matched" vérifie si la route (ou ses parents) possède "requiresAuth"
  const isProtected = to.matched.some(record => record.meta.requiresAuth);

  if (isProtected && !authStore.isAuthenticated) {
    // Si la route est protégée et qu'on n'est pas connecté -> redirection login
    next({ name: "login" });
  } else if (to.name === "login" && authStore.isAuthenticated) {
    // Optionnel : si on est déjà connecté, on empêche d'aller sur la page login
    next({ name: "home" });
  } else {
    // Sinon, on laisse passer
    next();
  }
});

export default router;