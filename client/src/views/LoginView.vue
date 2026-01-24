<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import api from "../services/api";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref(null);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.ref = true;
  error.value = null;

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    // On stocke les infos dans Pinia
    authStore.setToken(response.data.token);
    authStore.setUser(response.data.user);

    // Redirection vers l'accueil
    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.error || "Identifiants incorrects";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-slate-100"
  >
    <h1 class="text-2xl font-bold text-slate-800 mb-6 text-center">
      Connexion
    </h1>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700"
          >Mot de passe</label
        >
        <input
          v-model="password"
          type="password"
          required
          class="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
      >
        {{ isLoading ? "Connexion" : "Se connecter" }}
      </button>
    </form>
  </div>
</template>
