import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
    // --- STATE ---
    const token = ref(localStorage.getItem("token") || null);             // Récupère le token depuis le localStorage s'il existe
    const user = ref(JSON.parse(localStorage.getItem("user")) || null);   // Récupère les infos utilisateur depuis le localStorage s'il existe

    // --- GETTERS --- (Comme des $derived en Svelte 5)
    const isAuthenticated = computed(() => !!token.value);    // Retourne true si le token existe

    // --- ACTIONS --- (Fonctions pour modifier le state)
    function setToken(newToken) {
        token.value = newToken;
        localStorage.setItem("token", newToken);
    }

    function setUser(userData) {
        user.value = userData;
        localStorage.setItem("user", JSON.stringify(userData));
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return { token, user, isAuthenticated, setToken, setUser, logout };
});