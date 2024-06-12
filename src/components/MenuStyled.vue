<script setup lang="ts">
import { ref } from 'vue'
import ImageStyled from './ImageStyled.vue'
import { Auth } from '../auth'
import { useRouter } from 'vue-router'

const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())
const currentUser = ref(auth.currentUser())

const route = useRouter()

const signOut = () => {
  auth.signOut(() => {
    isLoggedIn.value = auth.isLoggedIn()
    currentUser.value = auth.currentUser()
    sessionStorage.removeItem('active')
    route.push('/signIn')
  })
}
</script>

<template>
  <nav class="navbar">
    <div class="container-fluid">
      <ImageStyled
        imageUrl="../../images/logo.png"
        altText="Logo com nome do app Link to Food em vermelho"
        width="6rem"
      />
      <h3>Olá, {{ currentUser && currentUser.email }}</h3>
      
      <div class="nav-icon">

            <a @click="signOut" class="dropdown-item" href="#">Sair</a>
        </div>
      </div>
  </nav>
</template>

<style scoped>
a {
  text-decoration: none;
}
img {
  width: 25px;
  height: 25px;
}

.avatar-image {
  width: 35px;
  height: 35px;
  border-radius: 30px;
}

.container-fluid {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.navbar {
  background-color: var(--white);
}

.navbar-nav {
  display: flex;
  gap: 30px;
}

.nav-icon {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: auto;
  text-decoration: none;
}

.nav-icon a {
  align-self: center;
  cursor: pointer;
  text-decoration: none;
  
}

.navbar-collapse {
  display: flex;
  justify-content: space-around;
}
</style>
