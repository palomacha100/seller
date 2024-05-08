<script lang="ts">
import { defineComponent } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import TextStyled from './TextStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'
import TabsComponent from './TabsComponent.vue'

export default defineComponent({
  components: {
    ButtonStyled,
    TextStyled,
    InputStyled,
    SelectStyled,
    TabsComponent
  },
  data() {
    return {
      estabDropdownOptions: [
        { value: 'option1', label: 'Cafeteria' },
        { value: 'option2', label: 'Hamburgueria' },
        { value: 'option3', label: 'Pizzaria' }
      ],
      stateDropdownOptions: [
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
      ],
      tabs: [
        { name: 'tab1', label: 'Endereço do restaurante' },
        { name: 'tab2', label: 'Tab 2' }
        // Adicione mais tabs conforme necessário
      ]
    }
  }
})
</script>
<template>
  <form>
    <TabsComponent :tabs="tabs">
      <template #tab1>
        <div>Conteúdo da Tab 1</div>
      </template>
      <template #tab2>
        <div>Conteúdo da Tab 2</div>
      </template>
      <!-- Adicione mais conteúdo para outras tabs conforme necessário -->
    </TabsComponent>
    <TextStyled text="Dados do restaurante" className="subtitle" width="50rem" height="2.8rem" />
    <InputStyled
      id="fullname"
      type="text"
      width="22.5rem"
      height="2.8rem"
      placeholder="Digite o nome do seu restaurante"
      borderColor="transparent"
    />
    <InputStyled
      id="phone-number"
      type="number"
      width="22.5rem"
      height="2.8rem"
      placeholder="Telefone do restaurante (apenas números)"
      borderColor="transparent"
    />
    <InputStyled
      id="teste"
      type="number"
      width="22.5rem"
      height="2.8rem"
      placeholder="CNPJ do restaurante (apenas números)"
      borderColor="transparent"
    />
    <SelectStyled
      id="establishment"
      label=""
      typeOfSelect="Tipo de cozinha"
      width="22.5rem"
      height="2.8rem"
      :options="estabDropdownOptions"
    />
    <TextStyled text="Endereço do restaurante" className="subtitle" width="50rem" height="2.8rem" />
    <InputStyled
      id="teste"
      type="number"
      width="22.5rem"
      height="2.8rem"
      placeholder="CEP (apenas números)"
      borderColor="transparent"
    />
    <SelectStyled
      id="state"
      label=""
      typeOfSelect="Estado"
      width="22.5rem"
      height="2.8rem"
      :options="stateDropdownOptions"
    />
  </form>
</template>

<style scoped>
form {
  background-color: rgba(237, 228, 161, 0.5);
}
</style>
