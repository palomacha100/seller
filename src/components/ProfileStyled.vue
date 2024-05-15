<script setup lang="ts">
import { defineModel, reactive, onMounted, ref } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TextStyled from './TextStyled.vue'
import { StoreService } from '@/storeService'
import Swal from 'sweetalert2'

const fullName = defineModel<string>('fullName', { default: '' })
const cnpj = defineModel<string>('cnpj', { default: '' })
const phoneNumber = defineModel<string>('phoneNumber')
const city = defineModel<string>('city', { default: '' })
const cep = defineModel<string>('cep')
const state = defineModel<string>('state', { default: '' })
const neighborhood = defineModel<string>('neighborhood', { default: '' })
const address = defineModel<string>('address', { default: '' })
const numberAddress = defineModel<string>('numberAddress')
const complementAddress = defineModel<string>('complementAddress', { default: '' })
const establishment = defineModel<string>('establishment', { default: '' })
const isStoreExists = ref(false)

const store = new StoreService()

const errors = reactive({
  fullName: '',
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

const handleFullName = (event: Event) => {
  fullName.value = (event.target as HTMLInputElement).value
  errors.fullName = validateField(fullName.value, 3, undefined, 'nome')
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

const handleCep = (event: Event) => {
  errors.cep = validateField(cep.value, undefined, [8], 'telefone')
  cep.value = (event.target as HTMLInputElement).value
  localStorage.setItem('cep', (event.target as HTMLInputElement).value)
}

const handleNumberAddress = (event: Event) => {
  errors.numberAddress = validateField(numberAddress.value, 1, undefined, 'numero')
  numberAddress.value = (event.target as HTMLInputElement).value
  localStorage.setItem('numberAddress', (event.target as HTMLInputElement).value)
}

const handleComplementAddress = (event: Event) => {
  complementAddress.value = (event.target as HTMLInputElement).value
  localStorage.setItem('complementAddress', (event.target as HTMLInputElement).value)
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
  return (
    fullName.value !== '' &&
    cnpj.value !== undefined &&
    phoneNumber.value !== undefined &&
    city.value !== '' &&
    cep.value !== undefined &&
    state.value !== '' &&
    neighborhood.value !== '' &&
    address.value !== '' &&
    numberAddress.value !== undefined
  )
}

const addressSearch = (event: Event) => {
  event.preventDefault()
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cep) {
        neighborhood.value = data.bairro || ''
        city.value = data.localidade || ''
        state.value = data.uf || ''
        address.value = data.logradouro || ''
        localStorage.setItem('state', state.value)
        localStorage.setItem('neighborhood', neighborhood.value)
        localStorage.setItem('city', city.value)
        localStorage.setItem('address', address.value)
      } else {
        console.error('CEP não encontrado.')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar CEP:', error)
    })
}

const estabDropdownOptions = [
  { value: 'Cafeteria', label: 'Cafeteria' },
  { value: 'Hamburgueria', label: 'Hamburgueria' },
  { value: 'Pizzaria', label: 'Pizzaria' }
]

const getModelByName = {
  fullName,
  cnpj,
  phoneNumber,
  cep,
  state,
  city,
  neighborhood,
  address,
  numberAddress,
  complementAddress,
  establishment
}

onMounted(() => {
  const formData = [
    'fullName',
    'cnpj',
    'phoneNumber',
    'cep',
    'state',
    'city',
    'neighborhood',
    'address',
    'numberAddress',
    'complementAddress',
    'establishment'
  ]
  formData.forEach((field) => {
    const storeData = localStorage.getItem(field) || ''
    const storeSeller = storeData ? storeData : null
    if (storeSeller !== null) {
      getModelByName[field as keyof typeof getModelByName].value = storeSeller
    }
  })
  if (!address.value && !isStoreExists.value) {
    isStoreExists.value = true
  }
})

let image: File

const imageUrl = ref('')

const handleCreateStore = () => {
  const boolean = canMoveToTab2()
  if (boolean)
    store.createStore(
      fullName.value,
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
  <template v-if="isStoreExists">
    <div class="main-container">
      <form>
        <div>
          <div>
            <img :src="imageUrl" />
            <input type="file" @change="handleImageChange" />
          </div>
          <TextStyled
            className="gray-bold-text"
            width=" 800px"
            height="2.8rem"
            text="Por favor, preencha todos os campos obrigatórios antes de prosseguir"
          />
        </div>
        <InputStyled
          v-model="fullName"
          id="fullName"
          type="text"
          width="100%"
          height="2.8rem"
          placeholder="Digite o nome do seu restaurante"
          borderColor="transparent"
          :error="errors.fullName"
          :handleChange="handleFullName"
        />
        <div class="phone-cnpj">
          <InputStyled
            v-model="cnpj"
            id="cnpj"
            type="string"
            width="24rem"
            height="2.8rem"
            placeholder="CNPJ do restaurante (apenas números)"
            borderColor="transparent"
            :error="errors.cnpj"
            :handleChange="handleCnpj"
            @input="handleCnpjInput"
          />
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
        <div class="cepSearch">
          <InputStyled
            v-model="cep"
            id="cep"
            type="number"
            width="100%"
            height="2.8rem"
            placeholder="CEP (apenas números)"
            borderColor="transparent"
            :error="errors.cep"
            :handleChange="handleCep"
          />
          <ButtonStyled
            className="transparent-button-blue-text"
            label="Pesquisar CEP"
            width="8rem"
            height="2.8rem"
            @click="addressSearch"
          />
        </div>

        <div class="address-content">
          <InputStyled
            v-model="state"
            id="state"
            type="text"
            placeholder="Estado"
            width="24rem"
            height="2.8rem"
            borderColor="transparent"
            disabled
          />
          <InputStyled
            v-model="city"
            id="city"
            type="text"
            width="24rem"
            height="2.8rem"
            placeholder="Cidade"
            borderColor="transparent"
            disabled
          />
        </div>
        <InputStyled
          v-model="neighborhood"
          id="neighborhood"
          type="text"
          width="100%"
          height="2.8rem"
          placeholder="Bairro"
          borderColor="transparent"
          disabled
        />
        <InputStyled
          v-model="address"
          id="address"
          type="text"
          width="100%"
          height="2.8rem"
          placeholder="Endereço"
          borderColor="transparent"
          disabled
        />
        <div class="phone-cnpj">
          <InputStyled
            v-model="numberAddress"
            id="numberAddress"
            type="number"
            width="24rem"
            height="2.8rem"
            placeholder="Número"
            borderColor="transparent"
            :error="errors.numberAddress"
            :handleChange="handleNumberAddress"
          />
          <InputStyled
            v-model="complementAddress"
            id="complementAddress"
            type="text"
            width="24rem"
            height="2.8rem"
            placeholder="Complemento (opcional)"
            borderColor="transparent"
            :handleChange="handleComplementAddress"
          />
        </div>

        <SelectStyled
          v-model="establishment"
          id="establishment"
          label=""
          typeOfSelect="Tipo de cozinha"
          width="100%"
          height="2.8rem"
          :options="estabDropdownOptions"
        />
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
  <template v-else>
    <div>
      <p>{{ address }}</p>
    </div>
  </template>
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

.phone-cnpj {
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: space-between;
}

.address-content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
}

.cepSearch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100px;
}
</style>
