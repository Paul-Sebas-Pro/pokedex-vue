<template>
  <header class="bg-slate-800 text-white p-4 flex gap-4 shadow-md">
    <RouterLink to="/" class="hover:text-yellow-400 font-medium">Accueil</RouterLink>
    <RouterLink to="/login" class="hover:text-yellow-400 font-medium">Connexion</RouterLink>
  </header>

  <main class="max-w-6xl mx-auto">
    <RouterView />
  </main>
</template>