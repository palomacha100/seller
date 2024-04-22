<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Auth } from '../auth'
import ButtonStyled from './ButtonStyled.vue'
import ImageStyled from './ImageStyled.vue'
import InputStyled from './InputStyled.vue'
import TextStyled from './TextStyled.vue'

const router = useRouter()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
const awaiting = ref(false)
const checked = defineModel<boolean>('remember', { default: true })

const auth = new Auth()

const isLoggedIn = ref(auth.isLoggedIn())
const currentUser = ref(auth.currentUser())

const signOut = () => {
  auth.signOut(() => {
    isLoggedIn.value = auth.isLoggedIn()
    currentUser.value = auth.currentUser()
  })
}

const errorEmail = ref('')
const errorPassword = ref('')
const errorCredential = ref('')

const onSubmit = () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  if (email.value == '') {
    return (errorEmail.value = 'É necessário informar um email')
  }
  if (password.value == '') {
    return (errorPassword.value = 'É necessário informar uma senha')
  }

  awaiting.value = true
  auth.signIn(
    email.value || '',
    password.value || '',
    () => {
      awaiting.value = false
      isLoggedIn.value = auth.isLoggedIn()
      currentUser.value = auth.currentUser()
      router.push('/')
    },
    () => {
      awaiting.value = false
      console.log('Não foi dessa vez!')
      errorCredential.value = 'Email ou senha incorretos. Confira-os'
    }
  )
}

function handleEmail() {
  console.log('Aqui handleEmail')
  const re = /\S+@\S+\.\S+/
  if (!re.test(email.value)) {
    errorEmail.value = 'Por favor, digite um email válido'
  } else {
    errorEmail.value = ''
  }
}

function handlePassword() {
  console.log('Aqui handlePassword')
  if (password.value.length < 6) {
    errorPassword.value = 'Por favor, digite um password válido'
  } else {
    errorPassword.value = ''
  }
}
</script>

<template>
  <template v-if="isLoggedIn">
    <h3>Olá, {{ currentUser && currentUser.email }}</h3>
    <br />
    <nav>
      <a @click="signOut">Sair</a>
    </nav>
  </template>

  <template v-else>
    <div class="background-styled">
      <div class="form-container">
        <ImageStyled
          imageUrl="../../images/logo.png"
          altText="Logo em azul com nome do app Link to Food"
          width="11.25rem"
        />
        <form @submit.prevent="onSubmit">
          <InputStyled
            v-model="email"
            id="email"
            type="email"
            width="22.5rem"
            height="2.8rem"
            placeholder="Digite seu email"
            borderColor="transparent"
            :handleChange="handleEmail"
            :error="errorEmail"
          />

          <InputStyled
            v-model="password"
            id="password"
            type="password"
            width="22.5rem"
            height="2.8rem"
            placeholder="Digite sua senha"
            borderColor="transparent"
            :handleChange="handlePassword"
            :error="errorPassword"
          />

          <InputStyled
            v-model="checked"
            id="checked"
            type="checkbox"
            width="7rem"
            height="2rem"
            class="radio-container"
            label="Lembrar-me"
            placeholder=""
          />

          <ButtonStyled
            type="submit"
            v-show="!awaiting"
            className="login-button"
            label="Entrar"
            width="22.5rem"
            height="2.8rem"
          />

          <span>{{ errorCredential }}</span>
        </form>
        <nav>
          <RouterLink :to="{ name: 'signUp' }"
            ><ButtonStyled
              className="transparent-button-blue-text"
              label="Esqueceu a senha?"
              width="10rem"
              height="3rem"
          /></RouterLink>
        </nav>
        <div class="sign-up-container">
          <TextStyled
            text="Não tem uma conta?"
            width="10rem"
            height="2.8rem"
            className="grey-bold-text"
          />
          <nav>
            <RouterLink :to="{ name: 'signUp' }">
              <ButtonStyled
                className="transparent-button-blue-text"
                label="Cadastre-se"
                width="7rem"
                height="2.8rem"
              />
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  height: 17rem;
}
nav {
  display: flex;
  justify-content: center;
}

span {
  color: var(--red);
  font-size: 0.875rem;
}

.sign-up-container {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>

<style>
.form-container {
  padding: 20px 15px 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27rem;
  height: 33rem;
  background-color: rgba(237, 228, 161, 0.8);
  border-radius: 5px;
  margin: auto;
  justify-content: center;
  gap: 4px;
}
</style>

<style>
.background-styled {
  height: 100vh;
  width: 100%;
  background-image: url('../../images/pizza.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
}
</style>
