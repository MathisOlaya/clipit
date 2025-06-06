<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: '70%',
  },
})
</script>
<template>
  <hr :width="size" />
</template>
<style>
hr {
  margin: 32px 0;
  background-color: #1d2e61;
  height: 2px;
  border: none;
}
</style>
