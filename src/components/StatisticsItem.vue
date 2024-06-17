<template>
  <div>
    <h1>Resultado da Análise</h1>
    <div v-if="imagePath">
      <img :src="imagePath" alt="Anacor Plot" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from 'vue'
import { fetchAnalysis } from '@/api/analisysService'

const props = defineProps<{ storeId: number }>()
const imagePath = ref<string | null>(null)

const getAnalysis = async (storeId: number) => {
  const image = await fetchAnalysis(storeId)
  imagePath.value = image
}

watch(() => props.storeId, (newStoreId) => {
  if (newStoreId) {
    getAnalysis(newStoreId)
  }
}, { immediate: true })
</script>

<style scoped>
h1 {
  font-family: 'Poppins', sans-serif;
}
img {
  max-width: 100%;
  height: auto;
}
</style>


  