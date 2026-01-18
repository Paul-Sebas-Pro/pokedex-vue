<script setup>
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login"); // Redirection vers la page de login
};
</script>

<template>
  <header
    class="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md"
  >
    <div class="flex gap-4">
      <RouterLink to="/" class="hover:text-yellow-400 font-medium"
        >Accueil</RouterLink
      >
    </div>

    <div class="flex gap-4 items-center">
      <template v-if="authStore.isAuthenticated">
      <RouterLink to="/login" class="hover:text-yellow-400 font-medium"
        >Connexion</RouterLink
      >
      </template>
      
      <template v-else>
        <span class="text-slate-400">Salut, {{ authStore.user?.pseudo }}</span>
        <button 
        @click="handleLogout" 
        class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
        >
        Déconnexion
      </button>
    </template>
  </div>
  </header>

  <main class="max-w-6xl mx-auto">
    <RouterView />
  </main>
</template>
