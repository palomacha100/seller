<template>
    <div>
      <input v-model="searchQuery" placeholder="Pesquisar por nome da loja" class="search-input" />
  
      <table>
        <thead>
          <tr>
            <th @click="sortByName">
              Nome da loja
              <span v-if="sortOrder === 'asc'">▲</span>
              <span v-if="sortOrder === 'desc'">▼</span>
            </th>
            <th>Imagem</th>
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
  
  <script>
  import { ref, onMounted, computed } from 'vue'
  import { StoreService } from '@/api/storeService'
    
  export default {
    name: 'StoresTable',
    setup() {
      const storeService = new StoreService()
      const stores = ref([])
      const searchQuery = ref('')
      const sortOrder = ref('asc')
  
      const fetchStores = async () => {
        await storeService.getStores(
          (response) => {
            response.json().then((data) => {
              stores.value = data
            })
          },
          () => {
            console.error('Failed to fetch stores')
          }
        )
      }
  
      const deleteStore = async (id) => {
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
  
      const editStore = (id) => {
        // Implement edit functionality or navigation to the edit page
        console.log('Edit store', id)
      }
  
      const toggleStatus = async (store) => {
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
  
      return {
        searchQuery,
        sortOrder,
        filteredStores,
        deleteStore,
        editStore,
        toggleStatus,
        sortByName
      }
    }
  }
  </script>
  
  <style>
  .search-input {
    margin-bottom: 1rem;
    padding: 8px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  th, td {
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
    background-color: #4CAF50; /* Green for edit */
    color: white;
  }
  
  button:nth-child(2) {
    background-color: #f44336; /* Red for delete */
    color: white;
  }
  
  button:last-child {
    background-color: #2196F3; /* Blue for status toggle */
    color: white;
  }
  </style>
  