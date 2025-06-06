<script setup lang="ts">
// Vue
import { ref } from 'vue'

// REFs
const url = ref('')
const errorMessage = ref('')

function submitDownloader(){
  // Set ERROR Message if URL is null
  if(!url.value){
    return errorMessage.value = "L'URL ne peut pas être vide"
  }

  // Else, unset error message
  errorMessage.value = null;

  // Create WebSocket Connexion
  const ws = new WebSocket(import.meta.env.VITE_BACKEND_WS || 'ws://localhost:3000');
  
}
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
