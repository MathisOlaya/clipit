<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import Hr from '../components/Hr.vue'
// Services
import ApiService from '../services/ApiService.ts'

// REFs
const url = ref('')
const secondaryVidIndex = ref(0)
const cutTime = ref(60)
const errorMessage = ref('')

const secondaryVids = ref([])

const buttonDisabled = ref(false)

function submitDownloader() {
  // Set ERROR Message if URL is null
  if (!url.value) {
    return (errorMessage.value = "L'URL ne peut pas être vide")
  }

  // Else, unset error message
  errorMessage.value = ''

  // Save Query
  localStorage.setItem('yt-url', url.value)
  localStorage.setItem('clip-fk', secondaryVidIndex.value.toString())
  localStorage.setItem('clip-duration', cutTime.value.toString())

  router.push({ name: 'download' })
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
      <button type="submit" @click="submitDownloader" :disabled="buttonDisabled">Créer</button>
    </div>
    <Hr size="20%" />

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
</style>
