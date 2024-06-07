<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ProductService } from '@/api/productService'
import TitleStyled from './TitleStyled.vue'
import InputStyled from './InputStyled.vue'
import ContainerStyled from './ContainerStyled.vue'
import { useRouter } from 'vue-router'
import ButtonStyled from './ButtonStyled.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const filteredProducts = ref<any[]>([])
const productService = new ProductService()
const products = ref<Product[]>([])
const searchQuery = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

interface Product {
  id: number
  title: string
  category: string
  image_url: string
  price: string
  active: boolean
  thumbnail_url: string
}

const fetchProducts = async (storeId: number) => {
  if (!storeId) {
    return
  }
  await productService.getProducts(
    storeId,
    (data: Product[]) => {
      products.value = data.data || []
      console.log(data)
      if (products.value.length > 0) {
        products.value.forEach((product) => {
          product.active = true
        })
      }
      products.value.map((product) => ({
        ...product,
        image_url: `${import.meta.env.VITE_API_URL}${product.image_url}`,
        thumbnail_url: `${import.meta.env.VITE_API_URL}${product.thumbnail_url}`
      }))
      filteredProducts.value = products.value
    },
    () => {
      console.error('Failed to fetch products')
    }
  )
}

const deleteProduct = async (productId: number) => {
  const storage = localStorage.getItem('activedStore')
  const storeData = storage ? JSON.parse(storage) : null
  const storeId = storeData ? storeData.id : null

  if (!storeId) {
    console.error('Failed to get storeId from localStorage')
    return
  }

  await productService.deleteProduct(
    storeId,
    productId,
    () => {
      products.value = products.value.filter((product) => product.id !== productId)
      filteredProducts.value = filteredProducts.value.filter((product) => product.id !== productId)
    },
    () => {
      console.error('Failed to delete product')
    }
  )
}

const editProduct = (id: number) => {
  router.push({ path: './products', query: { isEditing: 'true', id } })
}

const toggleStatus = async (storeId: number, product: Product) => {
  product.active = !product.active
  await productService.updateProduct(
    storeId,
    product.id,
    product,
    null,
    () => Swal.fire(`Status alterado`),
    () => Swal.fire('Erro ao alterar status')
  )
}

const sortByName = () => {
  if (sortOrder.value === 'asc') {
    products.value.sort((a, b) => a.title.localeCompare(b.title))
    sortOrder.value = 'desc'
  } else {
    products.value.sort((a, b) => b.title.localeCompare(a.title))
    sortOrder.value = 'asc'
  }
}

const sortByCategory = () => {
  if (sortOrder.value === 'asc') {
    products.value.sort((a, b) => a.category.localeCompare(b.category))
    sortOrder.value = 'desc'
  } else {
    products.value.sort((a, b) => b.category.localeCompare(a.category))
    sortOrder.value = 'asc'
  }
}

const sortByPrice = () => {
  if (sortOrder.value === 'asc') {
    products.value.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    sortOrder.value = 'desc'
  } else {
    products.value.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    sortOrder.value = 'asc'
  }
}

const addProduct = () => {
  router.push({ path: './products', query: { isNewProduct: 'true' } })
}

onMounted(() => {
  const storage = localStorage.getItem('activedStore') || ''
  const parse = storage ? JSON.parse(storage) : ''
  if (parse) {
    fetchProducts(parse.id)
  }
})

const handleFilter = () => {
  filteredProducts.value = products.value.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}
</script>

<template>
  <div class="table-container">
    <ContainerStyled width="68.75rem" height="3.5rem" backgroundColor="transparent">
      <TitleStyled title="Gerenciamento de produtos" />
    </ContainerStyled>
    <ContainerStyled width="68.75rem" height="3.5rem" :backgroundColor="'var(--light-blue)'">
      <InputStyled
        v-model="searchQuery"
        id="storeSearch"
        type="text"
        width="57rem"
        height="2.8rem"
        placeholder="Pesquisar pelo nome do produto"
        borderColor="transparent"
        class="custom-height"
        :handleChange="handleFilter"
      />
      <ButtonStyled
        className="login-button"
        label="+ Adicionar produto"
        width="10rem"
        height="2.5rem"
        @click="addProduct"
      />
    </ContainerStyled>

    <table>
      <thead>
        <tr>
          <th></th>
          <th @click="sortByName">
            Produto
            <span v-if="sortOrder === 'asc'">▲</span>
            <span v-if="sortOrder === 'desc'">▼</span>
          </th>
          <th @click="sortByCategory">
            Categoria
            <span v-if="sortOrder === 'asc'">▲</span>
            <span v-if="sortOrder === 'desc'">▼</span>
          </th>
          <th @click="sortByPrice">
            Preço
            <span v-if="sortOrder === 'asc'">▲</span>
            <span v-if="sortOrder === 'desc'">▼</span>
          </th>
          <th>Ações</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody v-if="filteredProducts">
        <tr v-for="product in filteredProducts" :key="product.id">
          <td><img :src="product.thumbnail_url" alt="Product Image" class="thumbnail" /></td>
          <td>{{ product.title }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td>
            <button class="edit-button" @click="editProduct(product.id)">Editar</button>
            <button class="delete-button" @click="deleteProduct(product.id)">Excluir</button>
          </td>
          <td>
            <button
              @click="toggleStatus(Number($route.query.storeId), product)"
              :class="['status-button', product.active ? 'active' : 'inactive']"
            >
              {{ product.active ? 'Ativo' : 'Inativo' }}
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
  background-color: var(--dark-blue);
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
