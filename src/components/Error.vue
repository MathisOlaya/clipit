<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <div class="error">
    <p>{{ text }}</p>
  </div>
</template>
<style scoped>
div {
  width: 100%;
  height: 32px;
  border-radius: 6px;
  background-color: #ef233c;
  border: 1px solid #a4161a;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
}

p {
  background-color: #ef233c;
  font-size: 13px;
}
</style>
