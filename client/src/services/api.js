import axios from "axios";
import { useAuthStore } from "../stores/auth";
import router from "../router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Intercepteur : avant chaque requête, on injecte le token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();

    // Si l'API renvoie 401 (Token périmé ou invalide)
    if (error.response && error.response.status === 401) {
      authStore.logout();     // Déconnecter l'utilisateur, on vide le store
      router.push("/login");  // Rediriger vers la page de connexion
    }

    return Promise.reject(error); // Propager l'erreur pour un traitement spécifique si besoin
  }
);

export default api;