<script setup lang="ts">
defineProps<{
  imageUrl: string
  altText?: string
  width?: string
  height?: string
}>()
</script>

<template>
  <img :src="imageUrl" :alt="altText" :style="{ width, height }" />
</template>
