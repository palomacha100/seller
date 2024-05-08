<script setup lang="ts">
import { defineModel } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import TextStyled from './TextStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TabsComponent from './TabsComponent.vue'

const fullName = defineModel<string>('fullName', { default: '' })
const cep = defineModel<number>('cep')

const addressSearch = (event: Event) => {
  event.preventDefault()
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`).then((data) =>
    data.json().then((response) => console.log(response))
  )
}

const estabDropdownOptions = [
  { value: 'option1', label: 'Cafeteria' },
  { value: 'option2', label: 'Hamburgueria' },
  { value: 'option3', label: 'Pizzaria' }
]

const stateDropdownOptions = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]
const tabs = [
  { name: 'tab1', label: 'Dados do restaurante' },
  { name: 'tab2', label: 'Horário de funcionamento' }
]
</script>
<template>
  <div class="main-container">
    <TabsComponent :tabs="tabs">
      <template #tab1>
        <form>
          <TextStyled
            text="Dados do restaurante"
            className="subtitle"
            width="50rem"
            height="2.8rem"
          />
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
              id="cnpj"
              type="number"
              width="24rem"
              height="2.8rem"
              placeholder="CNPJ do restaurante (apenas números)"
              borderColor="transparent"
            />
            <InputStyled
              id="phone-number"
              type="number"
              width="24rem"
              height="2.8rem"
              placeholder="Telefone do restaurante (apenas números)"
              borderColor="transparent"
            />
          </div>
          <div class="div"></div>
          <InputStyled
            v-model="cep"
            id="cep"
            type="number"
            width="100%"
            height="2.8rem"
            placeholder="CEP (apenas números)"
            borderColor="transparent"
          />
          <div class="address-content">
            <ButtonStyled
              className="transparent-button-blue-text"
              label="Pesquisar CEP"
              width="8rem"
              height="2.8rem"
              @click="addressSearch"
            />
            <SelectStyled
              id="state"
              label=""
              typeOfSelect="Estado"
              width="22.5rem"
              height="2.8rem"
              :options="stateDropdownOptions"
            />
            <InputStyled
              id="city"
              type="text"
              width="100%"
              height="2.8rem"
              placeholder="Cidade"
              borderColor="transparent"
            />
          </div>

          <SelectStyled
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
  width: 100vw;
  height: 100vh;
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
</style>
