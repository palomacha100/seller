<script setup lang="ts">
import { Auth } from '../auth'
import { ref } from 'vue'
import TextStyled from './TextStyled.vue'
import ButtonStyled from './ButtonStyled.vue'
import ImageStyled from './ImageStyled.vue'

const auth = new Auth()

const isLoggedIn = ref(auth.isLoggedIn())
const currentUser = ref(auth.currentUser())
const signOut = function () {
  auth.signOut(() => (isLoggedIn.value = auth.isLoggedIn()))
}
</script>

<template>
  <main>
    <div class="form-container">
      <ImageStyled
        imageUrl="../../images/logo.png"
        altText="Logo em azul com nome do aplicativo Link to Food"
        width="19rem"
      />
      <template v-if="isLoggedIn">
        <h3>Hi, {{ currentUser && currentUser.email }}</h3>
        <br />
        <nav>
          <a @click="signOut">Sign Out</a>
        </nav>
      </template>
      <template v-else>
        <TextStyled text="Faça login para ter acesso" className="text-container" width="15.6" />
        <nav>
          <RouterLink :to="{ name: 'signIn' }"
            ><ButtonStyled
              className="transparent-button-blue-text"
              label="Entrar"
              width="10rem"
              height="2rem"
            />
          </RouterLink>
          <RouterLink :to="{ name: 'signUp' }"
            ><ButtonStyled
              className="transparent-button-blue-text"
              label="Cadastrar"
              width="10rem"
              height="2rem"
          /></RouterLink>
        </nav>
      </template>
    </div>
  </main>
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

.form-container {
  padding: 60px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27rem;
  height: 30rem;
  background-color: rgba(237, 228, 161, 0.8);
  border-radius: 5px;
  margin: auto;
  gap: 50px;
}
</style>
