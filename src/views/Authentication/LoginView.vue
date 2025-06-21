<script setup>
import Input from '@/components/Input.vue'
import Error from '@/components/Error.vue'
import { Mail, LockKeyhole } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { AxiosError } from 'axios'
import ApiService from '@/services/ApiService'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorText = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function submitLogin() {
  if (!email.value || !password.value) {
    return (errorText.value = 'Un champ est manquant')
  }

  errorText.value = ''

  // User cred's
  const user = {
    mail: email.value,
    password: password.value,
  }

  // Submit to API
  try {
    const response = await ApiService.login(user)

    if (response.status === 200) {
      authStore.login()

      router.push('/')
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err)
    }
  }
}
</script>
<template>
  <main>
    <div class="container">
      <p>Se connecter</p>
      <Error v-if="errorText" :text="errorText" />
      <div class="inputs">
        <Input v-model="email" :icon="Mail" placeholder="Email" />
        <Input v-model="password" :icon="LockKeyhole" placeholder="Mot de passe" />
      </div>
      <button @click="submitLogin">C'est partit</button>
    </div>
  </main>
</template>
<style scoped>
main {
  height: 90vh;
  background-image: url('../../assets/background/auth.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  gap: 8px;
  padding: 24px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

button {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: #375098;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  cursor: pointer;
  background-color: #405eb2;
}

.container p:first-child {
  font-size: 24px;
}
</style>
