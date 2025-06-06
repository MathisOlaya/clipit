<script setup lang="ts">
// Vue
import { ref } from 'vue'

// REFs
const url = ref('')
const videoPreview = ref('')
const errorMessage = ref('')
const statusMessage = ref('')

function submitDownloader() {
  // Set ERROR Message if URL is null
  if (!url.value) {
    return (errorMessage.value = "L'URL ne peut pas être vide")
  }

  // Else, unset error message
  errorMessage.value = ''

  // Create WebSocket Connexion
  statusMessage.value = 'Connexion en cours au serveur'
  const ws = new WebSocket(import.meta.env.VITE_BACKEND_WS || 'ws://localhost:3000')

  ws.onopen = () => {
    statusMessage.value = 'Connexion au serveur établie'

    // Start VIDEO Downloading
    ws.send(JSON.stringify({ url: url.value }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    // Set status message
    statusMessage.value = data.message

    if (data.type === 'done') {
      // Save UUID
      localStorage.setItem('uuid-vid', data.id)

      // Set Preview
      videoPreview.value = `http://localhost:3000/video/${data.id}/preview`
    }
  }
}
</script>

<template>
  <main>
    <!-- Error -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <!-- Status Message -->
    <p v-if="statusMessage">{{ statusMessage }}</p>
    <div>
      <input
        v-model="url"
        type="url"
        name="url"
        placeholder="Coller l'URL de votre vidéo Youtube"
      />
      <button type="submit" @click="submitDownloader">Valider</button>
    </div>
    <video controls v-if="videoPreview">
      <source :src="videoPreview" type="video/mp4" />
    </video>
  </main>
</template>
