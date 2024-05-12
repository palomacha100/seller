<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column }}</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in localData" :key="rowIndex">
          <td v-for="(value, columnIndex) in row" :key="columnIndex">
            {{ value }}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const { localData } = defineProps({
  columns: Array,
  data: Array,
  localData: Array
})
</script>

<style scoped>
table {
  width: 800px;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid rgba(237, 228, 161, 0.5);
  text-align: left;
  padding: 8px;
  background-color: var(--white);
}

th {
  background-color: #f2f2f2;
}
</style>
