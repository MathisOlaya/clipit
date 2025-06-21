<script setup>
import { ref } from 'vue'

defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  icon: {
    type: Function,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
})

const inputValue = ref('')

const emit = defineEmits(['update:modelValue'])
function updateValue(event) {
  emit('update:modelValue', event.target.value)
  inputValue.value = event.target.value
}
</script>
<template>
  <div class="input">
    <component style="padding-left: 4px" :is="icon" />
    <input
      :value="inputValue"
      @input="updateValue"
      :type="type || 'text'"
      :placeholder="placeholder"
    />
  </div>
</template>
<style scoped>
.input {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #2d4484;
  padding: 4px;
  border-radius: 6px;

  width: 300px;
  height: 40px;
  transition: transform 0.2s ease-in-out;
}

.input:hover {
  transform: scale(1.01);
}

input {
  border: none;
  width: 100%;
  height: 100%;
}

input:focus {
  outline: none;
}
</style>
