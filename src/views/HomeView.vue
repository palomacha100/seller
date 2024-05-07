<script setup lang="ts">
import { ref } from 'vue'
import { Auth } from '../auth'
const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())
const currentUser = ref(auth.currentUser())

const signOut = () => {
  auth.signOut(() => {
    isLoggedIn.value = auth.isLoggedIn()
    currentUser.value = auth.currentUser()
  })
}
</script>

<template>
  <main>
    <h3>Olá, {{ currentUser && currentUser.email }}</h3>

    <br />
    <nav>
      <a @click="signOut">Sair</a>
    </nav>
  </main>
</template>
