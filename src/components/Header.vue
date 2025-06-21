<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/services/ApiService'

const authStore = useAuthStore()
// Check user authentication at start
onMounted(async () => {
  try {
    const response = await ApiService.getAuthenticationState()

    if (response.status === 200) {
      authStore.login()
    }
  } catch {
    authStore.logout()
  }
})
</script>
<template>
  <div class="main">
    <RouterLink :to="{ name: 'home' }">
      <h1>Clip It</h1>
    </RouterLink>
    <div>
      <RouterLink to="pricing"> Tarifs </RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" to="login">Se connecter</RouterLink>
      <RouterLink v-else to="profil">Profil</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.main div {
  display: flex;
  gap: 12px;
}

@media (max-width: 480px) {
  .main div {
    gap: 16px;
  }
}
</style>
