<script setup lang="ts">
import { defineModel, reactive, onMounted, ref } from 'vue'

import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TextStyled from './TextStyled.vue'
import { StoreService } from '@/api/storeService'
import Swal from 'sweetalert2'
const productName = defineModel<string>('productName', { default: '' })
const description = defineModel<string>('description', { default: '' })
const price = defineModel<string>('price')
const category = defineModel<string>('category', { default: '' })
const portion = defineModel<string>('portion', { default: '' })

const store = new StoreService()

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
  errors.price = validateField(price.value, 4, undefined, undefined, 'preço')
  price.value = (event.target as HTMLInputElement).value
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
    portion.value !== undefined
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

onMounted(() => {
  const formData = ['productName', 'price', 'description', 'category', 'portion']
  formData.forEach((field) => {
    const productData = localStorage.getItem(field) || ''
    const infoProduct = productData ? productData : null
    if (infoProduct !== null) {
      getModelByName[field as keyof typeof getModelByName].value = productData
    }
  })
})

let image: File

const imageUrl = ref('')

const handleCreateProduct = () => {
  const boolean = canMoveToTab2()
  console.log(category.value)
  if (boolean)
    store.createStore(
      productName.value,
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
</script>
<template>
  <div class="main-container">
    <form>
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
          @click.prevent="handleCreateProduct"
          type="submit"
          className="login-button"
          label="Adicionar produto"
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
  align-items: center;
  height: 450px;
}

.data-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 450px;
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

.img-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
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

.image-styled {
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 10px;
  width: 24rem;
  height: 450px;
}

.input-file {
  display: none;
}

.custom-button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: transparent;
  color: var(--dark-blue);
  border: none;
  border-radius: 5px;
  font-size: 0.875rem;
  font-family: 'Poppins';
  font-weight: 700;
}

.custom-button:hover {
  background-color: var(--white);
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
