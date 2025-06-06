<script>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="main">
    <RouterLink :to="{ name: 'home' }">
      <h1>Clip It</h1>
    </RouterLink>
    <div>
      <RouterLink to="pricing"> Tarifs </RouterLink>
      <RouterLink to="login">Se connecter</RouterLink>
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
</style>
