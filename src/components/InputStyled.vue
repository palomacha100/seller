<script setup lang="ts">
import { defineProps, type PropType } from 'vue'

const { id, placeholder, borderColor, width, height, label, error, handleChange } = defineProps({
  type: String,
  id: String,
  placeholder: String,
  borderColor: String,
  width: String,
  height: String,
  label: String,
  password: String,
  error: String,
  handleChange: {
    type: Function as PropType<(event: Event) => void>,
    default: undefined
  }
})

const model = defineModel<string | boolean>()
</script>

<template>
  <div>
    <div
      v-if="type === 'radio' || type === 'checkbox'"
      class="radio-container"
      :style="{ width, height, borderColor }"
    >
      <label :for="id">
        <input :id="id" :type="type" v-model="model" />
        {{ label }}
      </label>
    </div>

    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :style="{ width, height, borderColor }"
      v-model="model"
      @blur="handleChange"
    />
    <span>{{ error }}</span>
  </div>
</template>

<style scoped>
input {
  padding: 5px 10px;
  font-size: 1rem;
  background-color: var(--white);
  border-radius: 5px;
  margin: 5px 0;
}

input::placeholder {
  color: var(--dark-gray);
}
label {
  font-size: 1rem;
  color: var(--dark-gray);
}

.radio-container {
  display: flex;
  flex-direction: row;
}
</style>
