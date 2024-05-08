<template>
  <div :style="{ width, height }">
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="selectedOption">
      <option value="" disabled hidden>{{ typeOfSelect }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <template v-if="selectedOption"> {{ label }} selecionado: {{ selectedOption }} </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Option {
  value: string
  label: string
}

export default defineComponent({
  props: {
    id: String,
    label: String,
    options: {
      type: Array as () => Option[],
      required: true
    },
    typeOfSelect: String,
    width: String,
    height: String
  },
  data() {
    return {
      selectedOption: '' as string
    }
  }
})
</script>

<style scoped>
label {
  font-family: 'Poppins';
}

option {
  font-family: 'Poppins';
}

select {
  font-family: 'Poppins';
  width: 100%;
  height: 2.8rem;
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 0.875rem;
  background-color: var(--white);
  margin: 5px 0;
  color: var(--dark-gray);
  border-color: transparent;
}
</style>
