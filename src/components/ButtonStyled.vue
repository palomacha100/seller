<script setup lang="ts">
const props = defineProps<{
  label: string
  className: string
  isDisabled?: boolean
  width?: string
  height?: string
}>()

const emit = defineEmits(['click'])

function handleClick(event: MouseEvent) {
  if (!props.isDisabled) {
    emit('click', event)
  }
}
</script>
<template>
  <button :class="className" :style="{ width, height }" :disabled="isDisabled" @click="handleClick">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: 'Poppins';
  font-weight: 700;
}

.small-green-button,
.small-red-button,
.small-blue-button,
.small-yellow-button,
.small-gray-button {
  width: 10rem;
  height: 2rem;
  color: white;
  border: none;
}

.pagination-button {
  background-color: var(--light-blue);
  color: var(--dark-gray);
  width: 7rem;
  height: 2rem;
  font-weight: 300;
  font-size: 0.75rem;
}

.small-blue-button,
.medium-blue-button {
  background-color: var(--dark-blue);
}

.small-yellow-button,
.medium-yellow-button {
  background-color: var(--yellow);
}

.small-green-button,
.medium-green-button {
  background-color: var(--green);
}

.small-red-button,
.medium-red-button {
  background-color: var(--red);
}

.small-gray-button,
.medium-gray-button {
  background-color: var(--dark-gray);
}

.medium-blue-button,
.medium-red-button,
.medium-green-button,
.medium-yellow-button,
.medium-gray-button {
  width: 12rem;
  height: 2.5rem;
  color: white;
  border: none;
}

.login-button {
  background-color: var(--dark-blue);
  color: white;
  border: none;
}

.login-button:hover {
  background-color: var(--hover-blue);
}

.transparent-button-blue-text {
  background-color: transparent;
  color: var(--dark-blue);
  border: none;
}

.red-button {
  background-color: transparent;
  border-width: 2px;
  border-color: var(--red);
  color: var(--red);
  border-style: solid;
}
</style>
