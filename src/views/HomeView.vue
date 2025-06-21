<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAuthStore } from '@/stores/auth.ts'

import Hr from '../components/Hr.vue'
// Services
import ApiService from '../services/ApiService.ts'
import { AxiosError } from 'axios'

const authStore = useAuthStore()

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

  if (authStore.isAuthenticated) {
    // Save Query
    localStorage.setItem('yt-url', url.value)
    localStorage.setItem('clip-fk', secondaryVidIndex.value.toString())
    localStorage.setItem('clip-duration', cutTime.value.toString())

    router.push({ name: 'download' })
  } else {
    router.push({ name: 'login' })
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
  } catch (err: any) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data)
      errorMessage.value = err.response?.data
    } else {
      errorMessage.value = 'Erreur'
    }
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
    <div class="cut" style="display: flex; flex-direction: column; align-items: center">
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

    <div class="caption" style="">
      <div style="display: flex; flex-direction: column">
        <p>Un rendu de qualité</p>
        <p>Créer vos vidéos toutes faites en quelques clics seulement</p>
      </div>
      <img src="../assets/phone.png" alt="" />
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
  text-align: center;
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

.caption {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.caption img {
  width: 900px;
}

.caption div p:first-child {
  font-size: 32px;
}

@media (max-width: 480px) {
  main {
    padding: 0 20px;
  }
  h1 {
    font-size: 24px;
  }

  .url-input {
    gap: 12px;
  }
  .url-input input {
    width: 200px;
  }
  .url-input p {
    text-align: center;
    max-width: 100px;
  }

  .secondaryVidsContainer {
    flex-direction: column;
  }

  .secondaryVidsContainer img:first-child {
    width: 100%;
    height: 150px;
  }

  .secondaryVid p {
    text-align: center;
  }

  input[type='range'] {
    width: 250px;
  }

  .caption {
    flex-direction: column;
  }

  .caption div p:first-child {
    font-size: 22px;
  }

  .caption div {
    align-items: center;
    max-width: 380px;
  }

  .caption div p {
    text-align: center;
  }

  .caption img {
    width: auto;
    height: 350px;
  }
}
</style>
