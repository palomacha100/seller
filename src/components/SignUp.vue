<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Auth } from '../auth'
import ImageStyled from './ImageStyled.vue'
import InputStyled from './InputStyled.vue'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const password_confirmation = ref<string>('')
const error = ref<string>('')
const isDisabled = ref<boolean>(true)
const awaiting = ref<boolean>(false)

import { reactive } from 'vue'

const formData = reactive({
  email: '',
  password: '',
  password_confirmation: ''
})

console.log(formData.email)

function handleChange() {
  if (password.value !== password_confirmation.value || password.value == '') {
    error.value = 'As senhas não coincidem'
    isDisabled.value = true
  } else {
    isDisabled.value = false
    error.value = ''
  }
}

function onSubmit() {
  let auth = new Auth()
  if (password.value.length < 6) {
    isDisabled.value = true
    return (error.value = 'A senha deve conter no mínimo 6 caracteres')
  }
  awaiting.value = true
  auth.signUp(
    email.value || '',
    password.value || '',
    password_confirmation.value || '',
    () => {
      awaiting.value = false
      router.push('/')
    },
    () => {
      awaiting.value = false
      console.log('não foi dessa vez!')
    }
  )
}
</script>
<template>
  <div class="background-styled">
    <div class="form-container">
      <ImageStyled
        imageUrl="../../images/logo.png"
        altText="Logo em azul com nome do app Link to Food"
        width="11.25rem"
      />
      <form @submit.prevent="onSubmit">
        <InputStyled
          v-model="formData.email"
          type="email"
          id="email"
          width="22.5rem"
          height="2.8rem"
          placeholder="Digite seu email"
          borderColor="transparent"
        />

        <InputStyled
          @change="handleChange"
          v-model="formData.password"
          type="password"
          id="password"
          width="22.5rem"
          height="2.8rem"
          placeholder="Digite sua senha"
          borderColor="transparent"
        />

        <InputStyled
          @change="handleChange"
          v-model="formData.password_confirmation"
          type="password"
          id="password_confirmation"
          width="22.5rem"
          height="2.8rem"
          placeholder="Confirme sua senha"
          borderColor="transparent"
        />

        <span>{{ error }}</span>
        <button type="submit" :disabled="isDisabled || awaiting">Cadastrar</button>
      </form>
    </div>
  </div>
</template>
