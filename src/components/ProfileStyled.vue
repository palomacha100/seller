<script setup lang="ts">
import { defineModel, reactive, onMounted, ref } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TextStyled from './TextStyled.vue'
import TitleStyled from './TitleStyled.vue'
import { StoreService } from '@/api/storeService'
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router'
import ContainerStyled from './ContainerStyled.vue'

const route = useRoute()
const isStoreExists = ref(false)
const isEditing = ref(false)
const themeOptions = ref([])
const store = new StoreService()
const imageUrl = ref('')
let image: File

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
const theme = defineModel<string>('theme', { default: 'blue' })
const active = defineModel<boolean>('active', { default: true})

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

const handleEstablishment = (event: Event) => {
  establishment.value = (event.target as HTMLSelectElement).value
  localStorage.setItem('establishment', establishment.value)
}

const handleTheme = (event: Event) => {
  localStorage.setItem('theme', (event.target as HTMLSelectElement).value)
  theme.value = (event.target as HTMLSelectElement).value
  console.log(theme.value)

}

const canMoveToTab2 = () => {
  const requiredFields = [
    fullName.value,
    cnpj.value,
    phoneNumber.value,
    city.value,
    cep.value,
    state.value,
    neighborhood.value,
    address.value,
    numberAddress.value,
    establishment.value,
    theme.value
  ];

  return requiredFields.every(value => value !== '' && value !== undefined);
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
        console.error('CEP não encontrado.'), () => Swal.fire('CEP não encontrado')
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
  fullName: fullName,
  cnpj: cnpj,
  phoneNumber: phoneNumber,
  cep: cep,
  state: state,
  city: city,
  neighborhood: neighborhood,
  address: address,
  numberAddress: numberAddress,
  complementAddress: complementAddress,
  establishment: establishment,
  theme: theme,
  active: active
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
    'establishment',
    'theme'
  ]
  formData.forEach((field) => {
    const storeData = localStorage.getItem(field) || ''
    const storeSeller = storeData ? storeData : null
    if (storeSeller !== null) {
      getModelByName[field] = storeSeller
    }
  })
  const storeData = localStorage.getItem('store') || ''
  const storeSeller = storeData ? storeData : null
  if (storeSeller !== null) {
    imageUrl.value = JSON.parse(storeSeller).src
  }
  if (!address.value && !isStoreExists.value) {
    isStoreExists.value = true
  }
  if (route.query.isEditing === 'true') {
    isEditing.value = true
    store.getStoresById(
      Number(route.query.id),
      (storeDataTwo: any) => {
        fullName.value = storeDataTwo.name
        cnpj.value = storeDataTwo.cnpj
        phoneNumber.value = storeDataTwo.phonenumber
        city.value = storeDataTwo.city
        cep.value = storeDataTwo.cep
        state.value = storeDataTwo.state
        neighborhood.value = storeDataTwo.neighborhood
        address.value = storeDataTwo.address
        numberAddress.value = storeDataTwo.numberaddress
        complementAddress.value = storeDataTwo.complementadress
        establishment.value = storeDataTwo.establishment
        imageUrl.value = storeDataTwo.src
        isStoreExists.value = true
        theme.value = storeDataTwo.theme
        active.value = storeDataTwo.active
      },
      () => {
        console.error('Failed to fetch stores')
      }
    )
  }
  if (route.query.isNewStore === 'true') {
    isEditing.value = true
    fullName.value = ''
    cnpj.value = ''
    phoneNumber.value = ''
    city.value = ''
    cep.value = ''
    state.value = ''
    neighborhood.value = ''
    address.value = ''
    numberAddress.value = ''
    complementAddress.value = ''
    establishment.value = ''
    imageUrl.value = ''
    theme.value = 'blue'
  }
  store.getTheme(
    (data: any) => {
      themeOptions.value = data.themes
    },
    () => {
      console.log('deu ruim')
    }
  )
})

const handleCreateStore = () => {
  const boolean = canMoveToTab2()
  if (boolean)
    store.createStore(
      getModelByName,
      image,
      () => Swal.fire('Loja criada com sucesso'),
      () => Swal.fire('Erro ao cadastrar loja')
    )
}

const handleUpdateStore = () => {
  const boolean = canMoveToTab2()
  const storeId = route.query.id || ''
  if (boolean) {
    store.updateStore(
      Number(storeId),
      getModelByName,
      image,
      () => {
        const getId = store.storage.get('store') || ''
        const parse = getId ? JSON.parse(getId) : ''
        imageUrl.value = parse.src
        isEditing.value = false

        Swal.fire('Loja atualizada com sucesso')
        isStoreExists.value = false
      },
      () => Swal.fire('Erro ao atualizar loja')
    )
  }
}

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const file = inputElement.files ? inputElement.files[0] : null
  if (file) {
    image = file
    imageUrl.value = URL.createObjectURL(file)
  }
}

const handleEdit = () => {
  isEditing.value = true
  const getId = store.storage.get('store') || ''
  const parse = getId ? JSON.parse(getId) : ''
  imageUrl.value = parse.src
}
</script>
<template>
  <template v-if="isStoreExists || isEditing">
    <div class="main-container">
      <form>
        <ContainerStyled width="800px" height="4rem" backgroundColor="transparent">
          <TitleStyled className="title-styled" title="Edição de perfil" />
        </ContainerStyled>
        <div class="image-data-container">
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
          <div class="first-data-content">
            <InputStyled
              v-model="fullName"
              id="fullName"
              type="text"
              class="full-input"
              :error="errors.fullName"
              :handleChange="handleFullName"
            />
            <InputStyled
              v-model="cnpj"
              id="cnpj"
              type="string"
              class="full-input"
              placeholder="CNPJ do restaurante (apenas números)"
              :error="errors.cnpj"
              :handleChange="handleCnpj"
              @input="handleCnpjInput"
            />
            <InputStyled
              v-model="phoneNumber"
              id="phoneNumber"
              type="string"
              class="full-input"
              placeholder="Telefone do restaurante (apenas números)"
              :error="errors.phoneNumber"
              :handleChange="handlePhoneNumber"
              @input="handlePhoneInput"
            />
            <div class="cepSearch">
              <InputStyled
                v-model="cep"
                id="cep"
                type="number"
                class="full-input"
                placeholder="CEP (apenas números)"
                :error="errors.cep"
                :handleChange="handleCep"
              />
              <ButtonStyled
                className="transparent-button-blue-text"
                label="Pesquisar CEP"
                @click="addressSearch"
              />
            </div>
          </div>
        </div>

        <div class="address-content">
          <InputStyled
            v-model="state"
            id="state"
            type="text"
            class="full-input"
            placeholder="Estado"
            disabled
          />
          <InputStyled
            v-model="city"
            id="city"
            type="text"
            class="full-input"
            placeholder="Cidade"
            disabled
          />
        </div>
        <InputStyled
          v-model="neighborhood"
          id="neighborhood"
          type="text"
          class="full-input"
          placeholder="Bairro"
          disabled
        />
        <InputStyled
          v-model="address"
          id="address"
          type="text"
          class="full-input"
          placeholder="Endereço"
          disabled
        />
        <div class="address-content">
          <InputStyled
            v-model="numberAddress"
            id="numberAddress"
            type="number"
            class="full-input"
            placeholder="Número"
            :error="errors.numberAddress"
            :handleChange="handleNumberAddress"
          />
          <InputStyled
            v-model="complementAddress"
            id="complementAddress"
            type="text"
            class="full-input"
            placeholder="Complemento (opcional)"
            :handleChange="handleComplementAddress"
          />
        </div>

        <SelectStyled
          :selectedValue="establishment"
          v-model="establishment"
          id="establishment"
          typeOfSelect="Tipo de cozinha" 
          :options="estabDropdownOptions"
          :handleChange="handleEstablishment"
        />
        <SelectStyled
          :selectedValue="theme"
          v-model="theme"
          id="theme"
          typeOfSelect="Tema da Loja"
          :options="themeOptions"
          :handleChange="handleTheme"
        />
        <div class="button-container">
          <ButtonStyled
            @click.prevent="isEditing ? handleUpdateStore() : handleCreateStore()"
            type="submit"
            className="medium-blue-button"
            :label="isEditing ? 'Atualizar' : 'Enviar'"
          />
        </div>
      </form>
    </div>
  </template>
  <template v-else>
    <div class="main-container">
      <div class="profile">
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
        </div>
        <div class="data-text-container">
          <TitleStyled className="title-styled" :title="`${fullName}`" class="title-styled" />
          <TextStyled className="gray-text" :text="`CNPJ: ${cnpj}`" />
          <TextStyled className="gray-text" :text="`Telefone: ${phoneNumber}`" />
          <TextStyled
            className="gray-text"
            :text="`Endereço: ${address}, ${numberAddress}, ${complementAddress}, ${neighborhood}`"
          />
          <TextStyled className="gray-text" :text="`CEP: ${cep} - ${city} - ${state}`" />
          <TextStyled className="gray-text" :text="`Categoria: ${establishment}`" />
          <div class="button-container">
            <ButtonStyled
              @click="handleEdit"
              type="submit"
              className="medium-blue-button"
              label="Editar"
            />
            <nav>
              <RouterLink :to="{ name: 'home' }">
                <ButtonStyled
                  type="submit"
                  className="medium-blue-button"
                  label="Gerenciar lojas"
                />
              </RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
}

form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  width: 800px;
  height: 100%;
}

.data-text-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.image-data-container {
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
  height: 80px;
}

.first-data-content {
  display: flex;
  flex-direction: column;
  width: 400px;
}

.button-container {
  margin: 30px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}
</style>

<style>
.profile {
  display: flex;
  background-color: var(--white);
  justify-content: space-around;
  flex-direction: row;
  margin: 30px auto;
  width: 850px;
  height: auto;
  border-radius: 5px;
  padding: 10px;
  gap: 10px;
}
</style>
