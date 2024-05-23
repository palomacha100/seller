<template>
  <div class="table-container">
    <TitleStyled title="Gerenciamento de lojas" />
    <InputStyled
      v-model="searchQuery"
      id="storeSearch"
      type="text"
      width="68.75rem"
      height="2.8rem"
      placeholder="Pesquisar pelo nome da loja"
      :borderColor="'var(--dark-gray)'"
    />

    <table>
      <thead>
        <tr>
          <th>Imagem</th>
          <th @click="sortByName">
            Nome
            <span v-if="sortOrder === 'asc'">▲</span>
            <span v-if="sortOrder === 'desc'">▼</span>
          </th>
          <th>Ações</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="store in filteredStores" :key="store.id">
          <td>{{ store.name }}</td>
          <td><img :src="store.image_url" alt="Store Image" class="thumbnail" /></td>
          <td>
            <button @click="editStore(store.id)">Edit</button>
            <button @click="deleteStore(store.id)">Delete</button>
          </td>
          <td>
            <button @click="toggleStatus(store)">
              {{ store.active ? 'Deactivate' : 'Activate' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { StoreService } from '../api/storeService'
import TitleStyled from './TitleStyled.vue'
import InputStyled from './InputStyled.vue'

interface Store {
  id: number
  name: string
  image_url: string
  active: boolean
}

const storeService = new StoreService()
const stores = ref<Store[]>([])
const searchQuery = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const fetchStores = async () => {
  await storeService.getStores(
    (data: Store[]) => {
      stores.value = data
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
  // Implement edit functionality or navigation to the edit page
  console.log('Edit store', id)
}

const toggleStatus = async (store: Store) => {
  store.active = !store.active
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

const sortByName = () => {
  if (sortOrder.value === 'asc') {
    stores.value.sort((a, b) => a.name.localeCompare(b.name))
    sortOrder.value = 'desc'
  } else {
    stores.value.sort((a, b) => b.name.localeCompare(a.name))
    sortOrder.value = 'asc'
  }
}

const filteredStores = computed(() => {
  return stores.value.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  fetchStores()
})
</script>

<style>
.thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.table-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

table {
  width: 1100px;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  cursor: pointer;
}

th span {
  margin-left: 5px;
  font-size: 12px;
  color: #888;
}

button {
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

button:active {
  transform: scale(0.98);
}

button:first-child {
  background-color: #4caf50; /* Green for edit */
  color: white;
}

button:nth-child(2) {
  background-color: #f44336; /* Red for delete */
  color: white;
}

button:last-child {
  background-color: #2196f3; /* Blue for status toggle */
  color: white;
}
</style>
