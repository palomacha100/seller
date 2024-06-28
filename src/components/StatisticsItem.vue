<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { fetchAnalysis } from '@/api/analisysService'

const imagePath = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const { storeId } = defineProps<{ storeId: number }>()

const getAnalysis = async (storeId: number) => {
  try {
    const image = await fetchAnalysis(storeId)
    if (image) {
      imagePath.value = `${image}?${Date.now()}`
    } else {
      errorMessage.value = 'Falha ao carregar a imagem da análise'
    }
  } catch (error) {
    errorMessage.value = 'Erro ao buscar dados de análise'
  }
}

onMounted(() => {
  if (storeId) {
    getAnalysis(storeId)
  } else {
    errorMessage.value = 'Nenhuma loja ativa encontrada.'
  }
})

watch(() => storeId, (newStoreId) => {
  if (newStoreId) {
    getAnalysis(newStoreId)
  }
})
</script>
<template>
  <div>
    <h1>Resultado da Análise</h1>
    <div v-if="imagePath">
      <img :src="imagePath" alt="Anacor Plot" />
    </div>
    <div v-else>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-else>Carregando...</p>
    </div>
  </div>
</template>


<style scoped>
h1 {
  font-family: 'Poppins', sans-serif;
}
img {
  max-width: 100%;
  height: auto;
}
p {
  font-family: 'Poppins', sans-serif;
  color: var(--red);
}
</style>






  