<script setup>
// defineProps est l'équivalent de "export let" en Svelte
defineProps({
    pokemon: Object
});
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden group">
        <div class="bg-slate-50 h-40 flex items-center justify-center">
            <span class="text-4xl group-hover:scale-110 transition-transform">🐾</span>
        </div>
        
        <div class="p-4">
            <h3 class="font-bold text-lg text-slate-800 capitalize">{{ pokemon.name }}</h3>
            
            <div class="flex gap-2 mt-2">
                <span 
                    v-for="type in pokemon.types" 
                    :key="type.id"
                    :style="{ backgroundColor: `#${type.color}` }"
                    class="px-2 py-0.5 rounded text-xs font-semibold text-white shadow-sm"
                    >
                    {{ type.name }}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-500">
                <p>PV: <span class="font-semibold">{{ pokemon.hp }}</span></p>
                <p>ATK: <span class="font-semibold">{{ pokemon.atk }}</span></p>
            </div>
        </div>
    </div>
</template>