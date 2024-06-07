<script setup lang="ts">
defineProps<{
  title: string
  className: string
}>()
</script>

<template>
  <div :class="className">
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
.title-styled {
  width: 100%;
  display: flex;
  align-items: center;
}
.title-styled h1 {
  color: var(--dark-blue);
  font-size: 2rem;
}

.subtitle h1 {
  color: black;
  font-size: 1.5rem;
  font-weight: bold;


}
</style>
