<script setup lang="ts">
import { ref } from 'vue'
import ImageStyled from './ImageStyled.vue'
import { Auth } from '../auth'
import { useRouter } from 'vue-router'

const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())
const currentUser = ref(auth.currentUser())
const route = useRouter()

const getUsername = (email: any) => {
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};




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
      <ImageStyled class="responsive-menu-image"
        imageUrl="../../images/logo.png"
        altText="Logo com nome do app Link to Food em vermelho"
        width="6rem"
      />
      <h3>Olá, {{ currentUser && getUsername(currentUser.email) }}</h3>
      
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
  padding: 10px 20px;;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  @media (max-width: 780px) {
    padding: 10px 10px;
  }
}
.navbar {
  background-color: var(--white);
}

.navbar-nav {
  display: flex;
}

.nav-icon {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  height: 40px;
  text-decoration: none;
  width: 100px;
  @media (max-width: 780px) {
    width: auto;
    margin-left: 5px;
  }
}

.nav-icon a {
  align-self: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  color: var(--red);
  @media (max-width: 780px) {
    font-size: 12px;
}
}

.navbar-collapse {
  display: flex;
  justify-content: space-around;
}

h3 {
  color: var(--dark-gray);
  font-size: 16px;
  @media (max-width: 780px) {
    font-size: 12px;
}
}
</style>
