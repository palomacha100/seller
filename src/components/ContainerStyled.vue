<script setup lang="ts">
const { width, height, backgroundColor } = defineProps({
  width: String,
  height: String,
  backgroundColor: String,
  className: String
})
</script>
<template>
  <div :class="className" :style="{ width, height, backgroundColor }"><slot></slot></div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.title-container {
  width: 68.75rem;
  height: 3.5rem;
  background-color: transparent;
}

.buttons-container {
  width: 68.75rem;
  height: 3.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
