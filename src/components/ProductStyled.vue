<script setup lang="ts">
import { defineModel, reactive, onMounted, ref } from 'vue'

import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TextStyled from './TextStyled.vue'
import TitleStyled from './TitleStyled.vue'
import { ProductService } from '@/api/productService'
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router'
const productName = defineModel<string>('productName', { default: '' })
const description = defineModel<string>('description', { default: '' })
const price = ref<string>('')
const category = defineModel<string>('category', { default: '' })
const portion = defineModel<string>('portion', { default: '' })
const isEditing = ref(false)
const isProductExists =ref(false)
const route = useRoute()

const product = new ProductService()

const errors = reactive({
  productName: '',
  description: '',
  price: '',
  category: '',
  portion
})

const validateField = (
  value: any,
  minLength: number | undefined,
  maxLength: number | undefined,
  exactLengths: number[] | undefined,
  campo: string
): string => {
  if (minLength !== undefined && value.toString().length < minLength) {
    return `Digite um campo de ${campo} válido (pelo menos ${minLength} caracteres)`
  }

  if (exactLengths !== undefined && !exactLengths.includes(value.toString().length)) {
    return `Digite um campo de ${campo} válido (com ${exactLengths.join(' ou ')} caracteres)`
  }

  if (maxLength !== undefined && value.toString().length > maxLength) {
    return `O campo ${campo} não pode exceder ${maxLength} caracteres`
  }
  return ''
}

const handleProductName = (event: Event) => {
  productName.value = (event.target as HTMLInputElement).value
  errors.productName = validateField(productName.value, 3, undefined, undefined, 'produto')
  localStorage.setItem('productName', (event.target as HTMLInputElement).value)
}

const handleDescription = (event: Event) => {
  description.value = (event.target as HTMLTextAreaElement).value
  errors.description = validateField(description.value, 10, 100, undefined, 'descrição')
  localStorage.setItem('description', description.value)
}

const handlePrice = (event: Event) => {
  errors.price = validateField(price.value, 3, undefined, undefined, 'preço')
  price.value = priceMask((event.target as HTMLInputElement).value)
  localStorage.setItem('price', (event.target as HTMLInputElement).value)
}

const handleCategory = (event: Event) => {
  category.value = (event.target as HTMLSelectElement).value
  localStorage.setItem('category', category.value)
}

const handlePortion = (event: Event) => {
  portion.value = (event.target as HTMLSelectElement).value
  localStorage.setItem('portion', portion.value)
}

const canMoveToTab2 = () => {
  return (
    productName.value !== '' &&
    price.value !== undefined &&
    category.value !== undefined &&
    description.value !== undefined &&
    portion.value !== undefined &&
    imageUrl.value !== undefined
  )
}

const categoryDropdownOptions = [
  { value: 'Alimentos', label: 'Alimentos' },
  { value: 'Bebidas', label: 'Bebidas' }
]

const portionDropdownOptions = [
  { value: '1 pessoa', label: '1 pessoa' },
  { value: '2 pessoas', label: '2 pessoas' },
  { value: '3 pessoas', label: '3 pessoas' },
  { value: '4 pessoas', label: '4 pessoas' }
]

const getModelByName = {
  productName,
  price,
  description,
  category,
  portion
}

const handleUpdateProduct = () => {
  const boolean = canMoveToTab2()
  const getId = product.storage.get('activedStore') || ''
  const parse = getId ? JSON.parse(getId) : ''
  if (boolean) {
    product.updateProduct(
      parse.id,
      Number(route.query.id),
      getModelByName,
      image,
      () => {
        const getId = product.storage.get('store') || ''
        const parse = getId ? JSON.parse(getId) : ''
        imageUrl.value = parse.src
        isEditing.value = false
        Swal.fire('Produto atualizado com sucesso')
        isProductExists.value = false
      },
      () => Swal.fire('Erro ao atualizar produto')
    )
  }
}

onMounted(() => {
  const formData = ['productName', 'price', 'description', 'category', 'portion']
  formData.forEach((field) => {
    const productData = localStorage.getItem(field) || ''
    const infoProduct = productData ? productData : null
    if (infoProduct !== null) {
      getModelByName[field as keyof typeof getModelByName].value = productData
    }
  })
  if (route.query.isNewProduct === 'true') {
    isEditing.value = false
    productName.value = ''
    price.value = ''
    description.value = ''
    category.value = ''
    portion.value = ''
    imageUrl.value = ''
  }
  if (route.query.isEditing === 'true') {
    isEditing.value = true
    const store = localStorage.getItem('activedStore') || '';
    const parse = store ? JSON.parse(store)  : ''
    if (parse) {
      product.getProductsById(
        parse.id,
        Number(route.query.id),
        (productData: any) => {
          console.log(productData)
          productName.value = productData.title
          price.value = productData.price
          description.value = productData.description
          category.value = productData.category
          portion.value = productData.portion
          imageUrl.value = `${import.meta.env.VITE_API_URL}${productData.image_url}`
          isProductExists.value = true
        },
        () => {
          console.error('Failed to fetch stores')
        }
      )
    }
  }
})

let image: File

const imageUrl = ref('')

const handleCreateProduct = () => {
  const boolean = canMoveToTab2()
  const getId = product.storage.get('activedStore') || ''
  const parse = getId ? JSON.parse(getId) : ''
  const data = { productName, description, price, category, portion }
  if (boolean)
    product.createProduct(
      parse.id,
      data,
      image,
      () => Swal.fire('Produto cadastrado com sucesso'),
      () => Swal.fire('Erro ao cadastrar produto')
    )
}

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const file = inputElement.files ? inputElement.files[0] : null
  if (file) {
    image = file
    imageUrl.value = URL.createObjectURL(file)
  }
}

function priceMask(value: string): string {
  if (!value) return ''
  value = value.replace(/\D/gi, '')
  const arrayValue = value.split('')
  if (arrayValue.length <= 2) {
    return value
  } else {
    const length = arrayValue.length - 2
    arrayValue.splice(length, 0, '.')
    return arrayValue.join('')
  }
}
</script>
<template>
  <div class="main-container">
    <form>
      <ContainerStyled width="68.75rem" height="3.5rem" backgroundColor="transparent">
      <TitleStyled title="Edição de produto" />
    </ContainerStyled>
      <TextStyled
        className="gray-bold-text"
        width=" 800px"
        height="2.8rem"
        text="Por favor, preencha todos os campos obrigatórios antes de prosseguir"
      />
      <div class="image-name-container">
        <div class="image-styled">
          <div class="product-image">
            <img
              class="img-content"
              :src="imageUrl"
              v-if="imageUrl"
              accept="image/*"
              id="imagePreview"
            />
          </div>
          <input type="file" id="input-file" class="input-file" @change="handleImageChange" />
          <label for="input-file" class="custom-button">Escolher imagem do produto</label>
        </div>
        <div class="data-product">
          <InputStyled
            v-model="productName"
            id="productName"
            type="text"
            width="24rem"
            height="2.8rem"
            placeholder="Digite o nome do produto"
            borderColor="transparent"
            :error="errors.productName"
            :handleChange="handleProductName"
          />
          <SelectStyled
            v-model="category"
            id="category"
            label=""
            typeOfSelect="Categoria"
            width="100%"
            :options="categoryDropdownOptions"
            :handleChange="handleCategory"
          />
          <InputStyled
            v-model="price"
            id="price"
            type="string"
            width="24rem"
            height="2.8rem"
            placeholder="Preço do produto"
            borderColor="transparent"
            :error="errors.price"
            :handleChange="handlePrice"
          />
          <div class="text-area-container">
            <textarea
              v-model="description"
              id="description"
              type="text-area"
              placeholder="Descrição do produto"
              :style="{ borderColor: errors.description ? 'var(--red)' : 'transparent' }"
              :onInput="handleDescription"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>
          <SelectStyled
            v-model="portion"
            id="portion"
            label=""
            typeOfSelect="Esse prato serve quantas pessoas?"
            width="100%"
            :options="portionDropdownOptions"
            :handleChange="handlePortion"
          />
        </div>
      </div>
      <div class="button-container">
        <ButtonStyled
        @click.prevent="isEditing ? handleUpdateProduct() : handleCreateProduct()"
          type="submit"
          className="login-button"
          :label="isEditing ? 'Atualizar' : 'Enviar'"
          width="18rem"
          height="2.8rem"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  background-color: rgba(237, 228, 161, 0.5);
  width: 100%;
  height: 100vh;
}

form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  width: 800px;
}

.image-name-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 450px;
}

.data-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 450px;
}

textarea {
  width: 24rem;
  height: 5rem;
  border-color: transparent;
  border-radius: 5px;
  margin: 5px 0;
  font-family: 'Poppins';
  font-size: 0.875rem;
  padding: 5px;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6rem;
}

span {
  width: 24rem;
  font-size: 0.75rem;
  font-family: 'Poppins';
  color: var(--red);
  display: inline;
  overflow: hidden;
}

.text-area-container {
  display: flex;
  flex-direction: column;
  height: 8rem;
}
</style>

<style>
.img-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.product-image {
  display: flex;
  background-image: url('../../images/background-image.png');
  width: 24rem;
  height: 20rem;
  border-radius: 5px;
  margin: 5px 0;
  background-repeat: no-repeat;
  background-size: contain;
}

.custom-button:hover {
  background-color: var(--white);
}

.custom-button {
  padding: 2px 16px 8px 16px;
  cursor: pointer;
  background-color: transparent;
  color: var(--dark-blue);
  border: none;
  border-radius: 5px;
  font-size: 0.875rem;
  font-family: 'Poppins';
  font-weight: 700;
}

.input-file {
  display: none;
}

.image-styled {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rem;
}
</style>
