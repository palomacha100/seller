<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Auth } from '../auth'
const router = useRouter()
const email = defineModel<string>('email')
const password = defineModel<string>('password', { default: '' })
const password_confirmation = defineModel<string>('password_confirmation')
const error = ref('')
const isDisabled = ref(true)

const awaiting = ref(false)

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
  <div class="form-container">
    <h1>Cadastro</h1>
    <form @submit.prevent="onSubmit">
      <label>E-Mail:</label>
      <input v-model="email" type="email" /><br />
      <label>Senha: </label>
      <input @change="handleChange" v-model="password" type="password" /><br />
      <label for="password_confirmation"
        >Repetição de senha:
        <input
          @change="handleChange"
          v-model="password_confirmation"
          type="password"
          id="password_confirmation"
        />
      </label>
      <span>{{ error }}</span>
      <button :disabled="isDisabled" type="submit" v-show="!awaiting">Cadastrar</button>
    </form>
  </div>
</template>
