<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

import Hr from '../components/Hr.vue'
// Services
import ApiService from '../services/ApiService.ts'

// REFs
const url = ref('')
const secondaryVidIndex = ref(0)
const cutTime = ref(60)
const previewURL = ref('')
const errorMessage = ref('')
const statusMessage = ref('')

const secondaryVids = ref([])

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
    ws.send(
      JSON.stringify({
        url: url.value,
        videoIndex: secondaryVidIndex.value,
        cuttingTime: cutTime.value,
      }),
    )
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    // Set status message
    statusMessage.value = data.message

    if (data.type === 'done') {
      // Save UUID
      localStorage.setItem('uuid-vid', data.id)

      // Set Preview
      previewURL.value = data.previewURL
    }
  }
}

function downloadVideo() {
  const uuid = localStorage.getItem('uuid-vid')
  const link = document.createElement('a')
  link.href = `${import.meta.env.VITE_BACKEND_HOST}/final/${uuid}.mp4`
  link.download = '🚀 Final - ClipIt.mp4'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getMinutesFromSeconds(seconds: number) {
  let remainingTime = seconds
  let minutes = 0

  while (remainingTime >= 60) {
    minutes++
    remainingTime -= 60
  }

  return minutes === 1
    ? `${minutes} minute et ${remainingTime} seconde(s)`
    : `${minutes} minutes et ${remainingTime} seconde(s)`
}

onMounted(async () => {
  // GET Secondary VIDS data^
  try {
    const response = await ApiService.getSecondaryVideos()

    if (response.status === 200) {
      secondaryVids.value = response.data.videos
    }
  } catch {
    errorMessage.value = 'Une erreur du serveur est intervenue'
  }
})
</script>

<template>
  <main>
    <!-- Error -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="content">
      <h1>Automatiser vos vidéos</h1>
      <div class="url-input">
        <input v-model="url" type="url" name="url" placeholder="URL de votre vidéo Youtube" />
        <p>Téléchargement automatique</p>
      </div>
    </div>
    <Hr />

    <div style="display: flex; flex-direction: column; align-items: center; gap: 16px">
      <p>Des vidéos secondaires à choix</p>
      <div class="secondaryVidsContainer">
        <div
          v-if="secondaryVids"
          v-for="(vids, index) in secondaryVids"
          :key="vids.metadata.id"
          class="secondaryVid"
        >
          <img :src="vids.coverURL" alt="" @click="secondaryVidIndex = vids.metadata.id" />
          <img
            v-if="secondaryVidIndex === vids.metadata.id"
            src="../assets/checkmark.png"
            alt="checkmark"
            class="checkmark"
          />
          <p>{{ vids.metadata.title }}</p>
        </div>
      </div>
    </div>
    <Hr />
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="display: flex; gap: 6px">
        <p>Découpage personnalisé :</p>
        <p>{{ cutTime >= 60 ? getMinutesFromSeconds(cutTime) : cutTime + ' secondes' }}</p>
      </div>
      <input type="range" v-model="cutTime" min="10" max="600" />
    </div>
    <Hr />
    <div class="creationButton">
      <p>Création de la vidéo en un temps éclair</p>
      <button type="submit" @click="submitDownloader">Créer</button>
    </div>
    <Hr size="20%" />
    <div class="downloadSection" v-if="statusMessage">
      <!-- Status Message -->
      <div class="statusContainer">
        <p class="status">{{ statusMessage }}</p>
        <span v-if="!previewURL" class="loader"></span>
      </div>
      <div v-if="previewURL" style="display: flex; flex-direction: column; align-items: center">
        <button @click="downloadVideo">Télécharger</button>
        <p>Prévisualisation de 10 secondes 👇</p>
        <video controls>
          <source :src="previewURL" type="video/mp4" />
        </video>
      </div>
    </div>
    <div style="display: flex; flex-direction: row; align-items: center">
      <div style="display: flex; flex-direction: column">
        <p style="font-size: 32px">Un rendu de qualité</p>
        <p>Créer vos vidéos toutes faites en quelques clics seulement</p>
      </div>
      <img width="900px" src="../assets/phone.png" alt="" />
    </div>
  </main>
</template>
<style scoped>
.error {
  padding: 8px 60px;
  border-radius: 12px;
  background-color: #ef233c;
  opacity: 0.8;
  border: 3px solid #a4161a;
}

.downloadSection {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.downloadSection video {
  width: 600px;
}

.statusContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.statusContainer p {
  font-size: 20px;
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

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
h1 {
  font-size: 42px;
  padding-bottom: 16px;
}
input {
  height: 48px;
  width: 432px;
  background-color: #eeeef0;
  color: #111113;
  border-radius: 24px;
  padding-left: 12px;
  transition: transform 0.3s ease-in-out;
}
input:hover {
  transform: scale(1.01);
}
input:focus {
  outline: none;
  border: 2px solid #3d63dd;
}

.url-input {
  display: flex;
  align-items: center;
  gap: 16px;
}

.secondaryVidsContainer {
  display: flex;
  gap: 12px;
}

.secondaryVid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.secondaryVid img:first-child {
  width: 420px;
  height: 240px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.secondaryVid img:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.checkmark {
  position: absolute;
  width: 75px;
  object-fit: cover;
  background-color: transparent;
}

button[type='submit'] {
  width: 260px;
  height: 48px;
  background-color: #3d63dd;
  border-radius: 16px;
  border: none;
  margin-top: 16px;
  transition: transform 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

button[type='submit']:hover {
  transform: scale(1.01);
  background-color: #405eb2;
}

.creationButton {
  display: flex;
  flex-direction: column;
  align-items: center;
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
