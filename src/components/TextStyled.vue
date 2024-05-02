<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  text: string
  width?: string
  height?: string
  className: string
}>()
</script>

<template>
  <div :class="className" :style="{ width, height }">
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.text-container {
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.gray-text p {
  color: var(--dark-gray);
}
.red-text p {
  color: var(--red);
  font-size: 0.875rem;
}
.white-bold-text p {
  color: var(--white);
  font-weight: 700;
}
.white-small-text p {
  color: var(--white);
  font-size: 0.875rem;
}
.blue-bold-text p {
  color: var(--dark-blue);
  font-weight: 700;
}
.grey-bold-text p {
  color: var(--dark-gray);
  font-weight: 700;
}

.main-text {
  font-size: 2rem;
  color: var(--white);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
