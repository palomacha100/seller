<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { StoreService } from '../api/storeService'
import TitleStyled from './TitleStyled.vue'
import InputStyled from './InputStyled.vue'
import ContainerStyled from './ContainerStyled.vue'
import { useRouter } from 'vue-router'
import ButtonStyled from './ButtonStyled.vue'

const router = useRouter()

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
      stores.value = data || []
      stores.value.forEach((store) => {
        const data = sessionStorage.getItem('active') || ''
        const parse = data ? JSON.parse(data) : '' 
        if (parse && store.id == parse) {
          store.active = true
        } else {
          store.active = false
        }
      })
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

const addStore = () => {
  router.push({ path: './profile', query: { isNewStore: 'true' } })
}

onMounted(() => {
  fetchStores()
})
</script>

<template>
  <div class="table-container">
    <ContainerStyled width="68.75rem" height="3.5rem" backgroundColor="transparent">
      <TitleStyled title="Gerenciamento de lojas" />
    </ContainerStyled>
    <ContainerStyled width="68.75rem" height="3.5rem" :backgroundColor="'var(--light-blue)'">
      <InputStyled
        v-model="searchQuery"
        id="storeSearch"
        type="text"
        width="57rem"
        height="2.8rem"
        placeholder="Pesquisar pelo nome da loja"
        borderColor="transparent"
        class="custom-height"
      />
      <ButtonStyled
        className="login-button"
        label="+ Adicionar loja"
        width="10rem"
        height="2.5rem"
        @click="addStore"
      />
    </ContainerStyled>

    <table>
      <thead>
        <tr>
          <th></th>
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
          <td><img :src="store.image_url" alt="Store Image" class="thumbnail" /></td>
          <td>{{ store.name }}</td>
          <td>
            <button class="edit-button" @click="editStore(store.id)">Editar</button>
            <button class="delete-button" @click="deleteStore(store.id)">Excluir</button>
          </td>
          <td>
            <button
              @click="toggleStatus(store)"
              :class="['status-button', store.active ? 'active' : 'inactive']"
            >
              {{ store.active ? 'Aberta' : 'Fechada' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

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
  margin-top: 0.5rem;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-family: 'Poppins';
  color: var(--dark-gray);
}

th {
  cursor: pointer;
  background-color: var(--light-blue);
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

.edit-button {
  background-color: var(--dark-blue); /* Green for edit */
  color: white;
}

.delete-button {
  background-color: var(--red);
  color: white;
}

.status-button.active {
  background-color: var(--green);
  color: white;
}

.status-button.inactive {
  background-color: var(--dark-gray);
  color: white;
}
</style>
