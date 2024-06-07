<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { StoreService } from '../api/storeService'
import TitleStyled from './TitleStyled.vue'
import InputStyled from './InputStyled.vue'
import ContainerStyled from './ContainerStyled.vue'
import { useRouter } from 'vue-router'
import ButtonStyled from './ButtonStyled.vue'
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



const fetchStores = async () => {
  await storeService.getStores(
    (data: Store[]) => {
      console.log(data)
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
  stores.value.forEach((s) => {
    if (s.id !== store.id && s.active) {
      s.active = false
      storeService.updateStore(
        s.id,
        s,
        null,
        () => {
          console.log(`Store ${s.id} deactivated`)
        },
        () => {
          console.error(`Failed to update store ${s.id}`)
        }
      )
    }
  })

  store.active = !store.active
  if (store.active) {
    localStorage.setItem('activedStore', JSON.stringify(store))
    sessionStorage.setItem('active', JSON.stringify(store.id))
  } else {
    localStorage.removeItem('activedStore')
  }
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

const themeActive = computed(() => {
  console.log(activeStore.value)
  return {
    backgroundColor: (activeStore.value && activeStore.value.theme) || 'white'
  };
});

onMounted(() => {
  fetchStores()
})
</script>

<template>
  <div class="tabs-container">
    <ContainerStyled width="68.75rem" height="3.5rem" backgroundColor="transparent">
      <TitleStyled className="title-styled" title="Gerenciamento de lojas" />
    </ContainerStyled>
    <ContainerStyled width="68.75rem" height="3.5rem" :backgroundColor="'var(--light-blue)'">
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

    <div v-if="activeStore" class="tab-content" :style="themeActive">
      <div class="store-details"  >
        <img :src="activeStore.image_url" alt="Store Image" class="thumbnail" />
        <TitleStyled className="subtitle" :title="activeStore.name"/>
        <p>Status: {{ activeStore.active ? 'Aberta' : 'Fechada' }}</p>
        <div class="actions">
          <ButtonStyled className="micro-blue-button" label="Editar" @click="editStore(activeStore.id)"/>
          <ButtonStyled className="micro-red-button" label="Excluir" @click="deleteStore(activeStore.id)"/>
          <button
            :class="['status-button', activeStore.active ? 'active' : 'inactive']"
            @click="toggleStatus(activeStore)"
          >
            {{ activeStore.active ? 'Fechar' : 'Abrir' }}
          </button>
        </div>
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
  font-size: 1.5rem;
  z-index: 1;
}

.tabs {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  flex: 1;
  white-space: nowrap;
  margin: 0 20px;
}

.tab {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid #ddd;
  border-bottom: none;
  flex-shrink: 0;
}

.tab.active {
  background-color: var(--primary-color);
  color: white;
}

.tab-content {
  padding: 20px;
  border-radius: 5px;
}

.store-details {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
