<script lang="ts">
import { defineComponent } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import TextStyled from './TextStyled.vue'
import InputStyled from './InputStyled.vue'
import SelectStyled from './SelectStyled.vue'

export default defineComponent({
  components: {
    ButtonStyled,
    TextStyled,
    InputStyled,
    SelectStyled
  },
  data() {
    return {
      dropdownOptions: [
        { value: 'option1', label: 'Cafeteria' },
        { value: 'option2', label: 'Hamburgueria' },
        { value: 'option3', label: 'Pizzaria' }
      ]
    }
  }
})
</script>
<template>
  <form>
    <TextStyled text="Dados do restaurante" className="subtitle" width="50rem" height="2.8rem" />
    <InputStyled
      id="teste"
      type="text"
      width="22.5rem"
      height="2.8rem"
      placeholder="Digite o nome do seu restaurante"
      borderColor="transparent"
    />
    <InputStyled
      id="teste"
      type="number"
      width="22.5rem"
      height="2.8rem"
      placeholder="Telefone do seu restaurante (apenas números)"
      borderColor="transparent"
    />
    <InputStyled
      id="teste"
      type="number"
      width="22.5rem"
      height="2.8rem"
      placeholder="CNPJ do seu restaurante (apenas números)"
      borderColor="transparent"
    />
    <SelectStyled
      id="myDropdown"
      label=""
      typeOfSelect="Tipo de cozinha"
      width="22.5rem"
      height="2.8rem"
      :options="dropdownOptions"
    />
  </form>
</template>

<style scoped>
form {
  background-color: rgba(237, 228, 161, 0.5);
}
</style>
