<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { StoreService } from '../api/storeService'
import TitleStyled from './TitleStyled.vue'
import InputStyled from './InputStyled.vue'
import ContainerStyled from './ContainerStyled.vue'
import { useRouter } from 'vue-router'
import ButtonStyled from './ButtonStyled.vue'
import OrderListing from './OrderListing.vue'
import TextStyled from './TextStyled.vue'

const router = useRouter()

interface Store {
  id: number
  name: string
  image_url: string
  active: boolean
  theme: string
}

const storeService = new StoreService()
const stores = ref<Store[]>([])
const searchQuery = ref<string>('')
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(10)
const activeTab = ref<number | null>(null)
const tabContainer = ref<HTMLDivElement | null>(null)
const activeStoreTab = ref<string>('orders')

const fetchStores = async () => {
  await storeService.getStores(
    (data: Store[]) => {
      stores.value = data || []
    },
    () => {
      console.error('Failed to fetch stores')
    }
  )
}

const deleteStore = async (id: number) => {
  await storeService.deleteStore(
    id,
    () => {
      stores.value = stores.value.filter((store) => store.id !== id)
    },
    () => {
      console.error('Failed to delete store')
    }
  )
}

const editStore = (id: number) => {
  router.push({ path: './profile', query: { isEditing: 'true', id } })
}

const toggleStatus = async (store: Store) => {
  store.active = !store.active
  localStorage.setItem('activedStore', JSON.stringify(store))
  sessionStorage.setItem('active', JSON.stringify(store.id))
  await storeService.updateStore(
    store.id,
    store,
    null,
    () => {
      console.log('Store status updated')
    },
    () => {
      console.error('Failed to update store status')
    }
  )
}

const filteredStores = computed(() => {
  return stores.value.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedStores = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStores.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStores.value.length / itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const addStore = () => {
  router.push({ path: './profile', query: { isNewStore: 'true' } })
}

const viewStore = (id: number) => {
  activeTab.value = id
}

const scrollTabs = (direction: 'left' | 'right') => {
  if (tabContainer.value) {
    tabContainer.value.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth'
    })
  }
}

const activeStore = computed(() => {
  return stores.value.find((store) => store.id === activeTab.value) || null
})
watch(activeStore, (newStore) => {
  if (newStore) {
    localStorage.setItem('activedStore', JSON.stringify(newStore))
  }
})

const themeActive = computed(() => {
  return {
    backgroundColor: (activeStore.value && activeStore.value.theme) || 'white'
  }
})

const setActiveStoreTab = (tab: string) => {
  activeStoreTab.value = tab
}

onMounted(() => {
  fetchStores()
})
</script>


<template>
  <div class="tabs-container">
    <ContainerStyled width="68.75rem" height="3.5rem" backgroundColor="transparent">
      <TitleStyled className="title-styled" title="Gerenciamento de lojas" />
    </ContainerStyled>
    <ContainerStyled width="68.75rem" height="5rem" backgroundColor="transparent">
      <InputStyled
        v-model="searchQuery"
        id="storeSearch"
        type="text"
        placeholder="Pesquisar pelo nome da loja"
        class="input-header"
      />
      <ButtonStyled className="medium-blue-button" label="+ Adicionar loja" @click="addStore" />
    </ContainerStyled>

    <div class="tabs-wrapper">
      <button class="arrow left" @click="scrollTabs('left')">◀</button>
      <div class="tabs" ref="tabContainer">
        <div
          v-for="store in paginatedStores"
          :key="store.id"
          :class="['tab', { active: activeTab === store.id }]"
          @click="viewStore(store.id)"
        >
          {{ store.name }}
        </div>
      </div>
      <button class="arrow right" @click="scrollTabs('right')">▶</button>
    </div>

    <div v-if="activeStore" class="tab-content">
      <div class="store-details" :style="themeActive">
        <img :src="activeStore.image_url" alt="Store Image" class="thumbnail" />
        <TitleStyled className="subtitle" :title="activeStore.name"/>
        <TextStyled width="auto" class="black-text" :text="`Status: ${activeStore.active ? 'Aberta' : 'Fechada'}`"/>
      </div>
      <div class="store-tabs">
        <button @click="setActiveStoreTab('orders')" :class="{ active: activeStoreTab === 'orders' }">Pedidos</button>
        <button @click="setActiveStoreTab('history')" :class="{ active: activeStoreTab === 'history' }">Histórico</button>
        <div class="dropdown">
          <button class="dropbtn">Configurações</button>
          <div class="dropdown-content">
            <ButtonStyled className="transparent-button-gray-text" label="Editar" @click="editStore(activeStore.id)" />
            <ButtonStyled :className="['transparent-button-gray-text', activeStore.active ? 'active' : 'inactive']"
              @click="toggleStatus(activeStore)" :label="activeStore.active ? 'Fechar' : 'Abrir'" />
            <ButtonStyled className="transparent-button-gray-text" label="Excluir" @click="deleteStore(activeStore.id)" />
          </div>
        </div>
      </div>
      <div class="store-content">
        <OrderListing v-if="activeStoreTab === 'orders'" :storeId="activeStore.id" :key="activeStore.id" />
        <!-- Componente de Histórico será adicionado aqui -->
      </div>
    </div>
    
    <div class="pagination">
      <ButtonStyled
        className="pagination-button"
        @click="prevPage"
        :disabled="currentPage === 1"
        label="Anterior"
      />
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <ButtonStyled
        className="pagination-button"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        label="Próxima"
      />
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  width: 68.75rem;
  margin: 0 auto;
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  width: 68.75rem;
}

.arrow {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  z-index: 1;
  color: var(--dark-gray);
  transition: color 0.3s;
}

.arrow:hover {
  opacity: 80%;
}

.tabs {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  flex: 1;
  white-space: nowrap;
  margin: 0 20px;
  gap: 5px;
}

.tab {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid #ddd;
  flex-shrink: 0;
  color: var(--dark-gray);
  border-radius: 5px;
  font-size: 14px;
}

.tab.active {
  background-color: var(--dark-blue);
  color: white;
  border-radius: 5px;
}

.tab-content {
  padding: 20px 0;
  border-radius: 5px;
}

.store-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-radius: 5px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 50px;
}

.actions {
  display: flex;
  gap: 10px;
}

.store-tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}


.store-tabs button {
  padding: 10px 20px;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: var(--dark-gray);
}

.store-tabs button.active {
  background-color: var(--dark-blue);
  color: var(--white);
  
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9; 
  min-width: 160px;
  z-index: 1;
}

.dropdown-content button {
 
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown:hover .dropdown-content {
  display: block;
  
}

.store-content {
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>

