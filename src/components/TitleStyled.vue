<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="title-styled">
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
.title-styled {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
}
.title-styled h1 {
  color: var(--dark-blue);
  font-size: 2rem;
}
</style>
