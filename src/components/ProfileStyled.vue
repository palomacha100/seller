<script setup lang="ts">
import { defineModel, computed } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TabsComponent from './TabsComponent.vue'

const fullName = defineModel<string>('fullName', { default: '' })
const cnpj = defineModel<number>('cnpj')
const phoneNumber = defineModel<number>('phoneNumber')
const city = defineModel<string>('city', { default: '' })
const cep = defineModel<number>('cep')
const state = defineModel<string>('state')
const neighborhood = defineModel<string>('neighborhood')
const address = defineModel<string>('address')
const numberAddress = defineModel<number>('numberAddress')
const complementAddress = defineModel<string>('complementAddress', { default: '' })
const establishment = defineModel<string>('establishment', { default: '' })

const canMoveToTab2 = computed(() => {
  console.log(fullName.value)
  console.log(cnpj.value)
  console.log(phoneNumber.value)
  console.log(city.value)
  console.log(cep.value)
  console.log(state.value)
  console.log(neighborhood.value)
  console.log(address.value)
  console.log(numberAddress.value)
  console.log(establishment.value)

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
})

const addressSearch = (event: Event) => {
  event.preventDefault()
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then((response) => response.json())
    .then((data) => {
      // Preencher os campos com os dados retornados da API
      if (data.cep) {
        neighborhood.value = data.bairro || ''
        city.value = data.localidade || ''
        state.value = data.uf || ''
        address.value = data.logradouro || ''
        // Preencher outros campos conforme necessário
      } else {
        console.error('CEP não encontrado.')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar CEP:', error)
    })
}

const estabDropdownOptions = [
  { value: 'option1', label: 'Cafeteria' },
  { value: 'option2', label: 'Hamburgueria' },
  { value: 'option3', label: 'Pizzaria' }
]

const tabs = [
  { name: 'tab1', label: 'Dados do restaurante' },
  { name: 'tab2', label: 'Horário de funcionamento' }
]
</script>
<template>
  <div class="main-container">
    <TabsComponent :tabs="tabs" :isTrue="canMoveToTab2">
      <template #tab1>
        <form>
          <div v-if="!canMoveToTab2" class="error-message">
            Por favor, preencha todos os campos obrigatórios antes de prosseguir.
          </div>
          <InputStyled
            v-model="fullName"
            id="fullName"
            type="text"
            width="100%"
            height="2.8rem"
            placeholder="Digite o nome do seu restaurante"
            borderColor="transparent"
          />
          <div class="phone-cnpj">
            <InputStyled
              v-model="cnpj"
              id="cnpj"
              type="number"
              width="24rem"
              height="2.8rem"
              placeholder="CNPJ do restaurante (apenas números)"
              borderColor="transparent"
            />
            <InputStyled
              v-model="phoneNumber"
              id="phoneNumber"
              type="number"
              width="24rem"
              height="2.8rem"
              placeholder="Telefone do restaurante (apenas números)"
              borderColor="transparent"
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
            />
            <InputStyled
              v-model="city"
              id="city"
              type="text"
              width="24rem"
              height="2.8rem"
              placeholder="Cidade"
              borderColor="transparent"
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
          />
          <InputStyled
            v-model="address"
            id="address"
            type="text"
            width="100%"
            height="2.8rem"
            placeholder="Endereço"
            borderColor="transparent"
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
            />
            <InputStyled
              v-model="complementAddress"
              id="complementAddress"
              type="text"
              width="24rem"
              height="2.8rem"
              placeholder="Complemento (opcional)"
              borderColor="transparent"
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
        </form>
      </template>
      <template #tab2>
        <div>Conteúdo da Tab 2</div>
      </template>
    </TabsComponent>
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
