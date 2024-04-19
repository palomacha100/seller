<script setup lang="ts">
import { ref } from 'vue'

const { id, type, placeholder, value, borderColor, width, height, label, checked } = defineProps<{
  id: string
  type: string
  placeholder: string | ''
  value: string | number
  borderColor?: string
  width?: string
  height?: string
  label?: string
  checked?: boolean
}>()

const modelValue = ref<string | number>(value)
const modelChecked = ref<boolean>(checked || false)
</script>

<template>
  <div>
    <div
      v-if="type === 'radio' || type === 'checkbox'"
      class="radio-container"
      :style="{ width, height, borderColor }"
    >
      <label :for="id">
        <input :id="id" :type="type" :value="value" v-model="modelChecked" />
        {{ label }}
      </label>
    </div>

    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
      :style="{ width, height, borderColor }"
    />
  </div>
</template>

<style scoped>
input {
  color: var(--dark-gray);
  font-size: 1rem;
  background-color: var(--white);
  border-radius: 5px;
}

.radio-container {
  display: flex;
  flex-direction: row;
}
</style>
