<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import PokemonCard from '../components/PokemonCard.vue';

const pokemons = ref([]);
const isLoading = ref(true);
const error = ref(null);

// onMounted est l'équivalent de onMount en Svelte
onMounted(async () => {
  try {
    const response = await api.get("api/pokemons");
    pokemons.value = response.data;
  } catch (err) {
    error.value = "Impossible de charger les Pokémons.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
    <div class="p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900">Pokédex National</h1>
        <p class="text-slate-500">Consultez la liste complète des Pokémons et leurs statistiques.</p>
      </header>
      
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PokemonCard 
            v-for="pokemon in pokemons" 
            :key="pokemon.id" 
            :pokemon="pokemon"
        />
      </div>
    </div>
</template>