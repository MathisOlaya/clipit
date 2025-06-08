<script setup>
// Vue
import { onMounted, ref } from 'vue'
import Hr from '@/components/Hr.vue'
import { Download } from 'lucide-vue-next'

const statusMessage = ref('')
const previewURL = ref('')
const previousVids = ref([])
const loaderVisible = ref(true)
const videoData = ref({})

onMounted(() => {
  // Get Query parameters
  const url = localStorage.getItem('yt-url')
  const clipFk = localStorage.getItem('clip-fk')
  const clipDuration = localStorage.getItem('clip-duration')

  // Create WebSocket Connexion
  statusMessage.value = 'Connexion en cours au serveur'
  const ws = new WebSocket(import.meta.env.VITE_BACKEND_WS || 'ws://localhost:3000')

  ws.onopen = () => {
    statusMessage.value = 'Connexion au serveur établie'

    // Start VIDEO Downloading
    ws.send(
      JSON.stringify({
        url: url,
        videoIndex: parseInt(clipFk),
        cuttingTime: parseInt(clipDuration),
      }),
    )
  }

  ws.onerror = (error) => {
    console.error(error)
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    loaderVisible.value = true

    // Set status message
    statusMessage.value = data.message

    // Did We receive video's data
    if (data.videoData) {
      videoData.value = data.videoData
    }

    // Mask loader
    if (data.type === 'done' || data.type === 'error') {
      loaderVisible.value = false
    }

    if (data.type === 'done') {
      // Save UUID
      localStorage.setItem('uuid-vid', data.id)

      // Set Preview
      previewURL.value = data.previewURL
    }
  }
})
</script>
<template>
  <div class="downloadSection" v-if="statusMessage">
    <h1>Création de la vidéo</h1>
    <!-- Status Message -->
    <div class="statusContainer">
      <p class="status">{{ statusMessage }}</p>
      <span v-if="!previewURL && loaderVisible" class="loader"></span>
      <button v-if="previewURL" class="downloadButton" @click="downloadVideo">
        <Download />
        Télécharger
      </button>
    </div>
    <div class="container" style="display: flex; flex-direction: row-reverse; gap: 10%">
      <div
        v-if="previewURL"
        style="display: flex; flex-direction: column; align-items: center; gap: 8px"
      >
        <p style="font-size: 22px">Prévisualisation de 10 secondes 👇</p>
        <video controls width="100%" style="max-width: 600px">
          <source :src="previewURL" type="video/mp4" />
        </video>
      </div>
      <div
        v-else
        style="display: flex; flex-direction: column; justify-content: center; align-items: center"
      >
        <h3>En cours...</h3>
        <p style="font-style: italic; max-width: 100%; text-align: center">
          Une prévisualisation du résultat s'affichera prochainement ici
        </p>
      </div>
      <div v-if="videoData" class="videoInformations">
        <p style="font-size: 22px; font-style: italic">{{ videoData.title }}</p>
        <img
          style="border-radius: 12px; width: 100%; max-width: 800px"
          :src="videoData.cover"
          alt=""
        />
      </div>
    </div>
    <Hr />
    <div class="previousCreation">
      <p style="font-size: 24px">Mes anciennes créations</p>
      <div style="display: flex; flex-direction: column; align-items: center; padding-top: 8px">
        <p v-if="previousVids">Vous n'avez créer aucune vidéo pour l'instant</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.videoInformations {
  display: flex;
  flex-direction: column;
  align-items: center;
  object-fit: contain;
  gap: 8px;
}
.previousCreation {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.downloadSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.downloadSection video {
  border-radius: 12px;
  width: 600px;
}

.statusContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 70%;
  background-color: #172448;
  border: 2px solid #3d63dd;
  border-radius: 12px;
}

.statusContainer p {
  background-color: #172448;
  font-size: 20px;
  padding: 8px 0;
}

.status {
  text-align: center;
}

.downloadButton {
  padding: 8px 12px;
  background-color: #0c111c;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.loader {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 1px solid;
  border-color: #fff #fff transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent #3f5cb0 #3f5cb0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
