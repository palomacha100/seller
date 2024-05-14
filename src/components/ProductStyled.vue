<script setup lang="ts">
import { defineModel, reactive, onMounted, ref } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TextStyled from './TextStyled.vue'
import { StoreService } from '@/storeService'
import Swal from 'sweetalert2'
const productName = defineModel<string>('productName', { default: '' })
const cnpj = defineModel<string>('cnpj', { default: '' })
const phoneNumber = defineModel<string>('phoneNumber')

const category = defineModel<string>('category', { default: '' })

const store = new StoreService()

const errors = reactive({
  productName: '',
  cnpj: '',
  phoneNumber: '',
  cep: '',
  numberAddress: ''
})

const validateField = (
  value: any,
  minLength: number | undefined,
  exactLengths: number[] | undefined,
  campo: string
): string => {
  if (minLength !== undefined && value.toString().length < minLength) {
    return `Digite um campo de ${campo} válido (pelo menos ${minLength} caracteres)`
  }

  if (exactLengths !== undefined && !exactLengths.includes(value.toString().length)) {
    return `Digite um campo de ${campo} válido (com ${exactLengths.join(' ou ')} caracteres)`
  }
  return ''
}

const handleProductName = (event: Event) => {
  productName.value = (event.target as HTMLInputElement).value
  errors.productName = validateField(productName.value, 3, undefined, 'nome')
  localStorage.setItem('fullName', (event.target as HTMLInputElement).value)
}

const handleCnpj = (event: Event) => {
  errors.cnpj = validateField(cnpj.value, undefined, [14], 'CNPJ')
  cnpj.value = (event.target as HTMLInputElement).value
  localStorage.setItem('cnpj', (event.target as HTMLInputElement).value)
}

const handlePhoneNumber = (event: Event) => {
  errors.phoneNumber = validateField(phoneNumber.value, undefined, [10, 11], 'telefone')
  phoneNumber.value = (event.target as HTMLInputElement).value
  localStorage.setItem('phoneNumber', (event.target as HTMLInputElement).value)
}

const handleCnpjInput = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  const newValue = input.value.replace(/\D/g, '')
  input.value = newValue
  cnpj.value = newValue
}

const handlePhoneInput = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  const newValue = input.value.replace(/\D/g, '')
  input.value = newValue
  phoneNumber.value = newValue
}

const canMoveToTab2 = () => {
  return productName.value !== '' && cnpj.value !== undefined && phoneNumber.value !== undefined
}

const categoryDropdownOptions = [
  { value: 'Alimentos', label: 'Alimentos' },
  { value: 'Bebidas', label: 'Bebidas' }
]

const getModelByName = {
  productName,
  cnpj,
  phoneNumber,
  category
}

onMounted(() => {
  const formData = ['productName', 'cnpj', 'phoneNumber', 'establishment']
  formData.forEach((field) => {
    const cnpjData = localStorage.getItem(field) || ''
    const cnpjSeller = cnpjData ? cnpjData : null
    if (cnpjSeller !== null) {
      getModelByName[field].value = cnpjSeller
    }
  })
})

let image: File

const imageUrl = ref('')

const handleCreateStore = () => {
  const boolean = canMoveToTab2()
  if (boolean)
    store.createStore(
      productName.value,
      image,
      () => Swal.fire('Loja criada com sucesso'),
      () => Swal.fire('Erro ao cadastrar loja')
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
        <div>
          <div class="product-image">
            <img :src="imageUrl" />
          </div>
          <input type="file" @change="handleImageChange" />
        </div>
        <div>
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
            height="2.8rem"
            :options="categoryDropdownOptions"
          />
        </div>
      </div>
      <div class="phone-cnpj">
        <textarea
          v-model="cnpj"
          id="cnpj"
          type="text-area"
          placeholder="Descrição do produto"
          borderColor="transparent"
          :error="errors.cnpj"
          :handleChange="handleCnpj"
          @input="handleCnpjInput"
        ></textarea>
        <InputStyled
          v-model="phoneNumber"
          id="phoneNumber"
          type="string"
          width="24rem"
          height="2.8rem"
          placeholder="Telefone do restaurante (apenas números)"
          borderColor="transparent"
          :error="errors.phoneNumber"
          :handleChange="handlePhoneNumber"
          @input="handlePhoneInput"
        />
      </div>

      <ButtonStyled
        @click.prevent="handleCreateStore"
        type="submit"
        className="login-button"
        label="Enviar"
        width="22.5rem"
        height="2.8rem"
      />
    </form>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  background-color: rgba(237, 228, 161, 0.5);
  width: 100%;
  height: 100%;
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
  gap: 10px;
  justify-content: space-between;
  align-items: center;
}

.product-image {
  background-color: var(--white);
  width: 120px;
  height: 120px;
  border-radius: 5px;
}

textarea {
  width: 24rem;
  height: 5rem;
  border-color: transparent;
  border-radius: 5px;
  margin: 5px 0;
}

.phone-cnpj {
  display: flex;
  flex-direction: row;
  gap: 5px;
  height: auto;
  justify-content: space-between;
}

.address-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
}
</style>
