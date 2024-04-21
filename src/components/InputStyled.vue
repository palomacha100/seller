<script setup lang="ts">
import { defineProps } from 'vue'

const { id, placeholder, borderColor, width, height, label } = defineProps({
  type: String,
  id: String,
  placeholder: String,
  borderColor: String,
  width: String,
  height: String,
  label: String
})
</script>

<template>
  <div>
    <div
      v-if="type === 'radio' || type === 'checkbox'"
      class="radio-container"
      :style="{ width, height, borderColor }"
    >
      <label :for="id">
        <input :id="id" :type="type" />
        {{ label }}
      </label>
    </div>

    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :style="{ width, height, borderColor }"
    />
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
