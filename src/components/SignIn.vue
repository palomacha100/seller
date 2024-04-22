<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Auth } from '../auth'
import ButtonStyled from './ButtonStyled.vue'
import ImageStyled from './ImageStyled.vue'
import InputStyled from './InputStyled.vue'
import TextStyled from './TextStyled.vue'

const router = useRouter()

const email = defineModel<string>('email')
const password = defineModel<string>('password')
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

const onSubmit = () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)

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
    }
  )
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
          />
          <InputStyled
            v-model="password"
            id="password"
            type="password"
            width="22.5rem"
            height="2.8rem"
            placeholder="Digite sua senha"
            borderColor="transparent"
          />

          <InputStyled
            v-model="checked"
            id="checked"
            type="checkbox"
            width="7rem"
            height="2.8rem"
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
        </form>
        <nav>
          <RouterLink :to="{ name: 'signUp' }"
            ><ButtonStyled
              className="transparent-button-blue-text"
              label="Esqueceu a senha?"
              width="10rem"
              height="4rem"
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
nav {
  display: flex;
  justify-content: center;
}

.sign-up-container {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>

<style>
.form-container {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27rem;
  height: 30rem;
  background-color: rgba(237, 228, 161, 0.8);
  border-radius: 5px;
  margin: auto;
  justify-content: center;
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
