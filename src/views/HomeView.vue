<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <!-- Error -->
     <p v-if="errorMessage">{{ errorMessage }}</p>
    <div >
      <input v-model="url" type="url" name="url" placeholder="Coller l'URL de votre vidéo Youtube">
      <button type="submit" @click="submitDownloader">Valider</button>
    </div>
  </main>
</template>
