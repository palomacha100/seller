<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import InputStyled from './InputStyled.vue'
import ButtonStyled from './ButtonStyled.vue'
import AccessControlContainer from './AccessControlContainer.vue'
import TextStyled from './TextStyled.vue'
import Swal from 'sweetalert2'

const router = useRouter()

const email = defineModel<string>('email', { default: '' })
const errorEmail = ref<string>('')

const awaiting = ref<boolean>(false)

function handleEmail() {
  const re = /\S+@\S+\.\S+/
  if (!re.test(email.value)) {
    errorEmail.value = 'Por favor, digite um email válido'
  } else {
    errorEmail.value = ''
  }
}

function onSubmit() {
  if (email.value == '') {
    return (errorEmail.value = 'É necessário informar um email')
  } else {
    Swal.fire({
      title: 'Email enviado',
      text: 'Verifique sua caixa de entrada',
      icon: 'success',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#2c5c8f'
    })
      router.push('/signIn')
  }
}
      
</script>
<template>
  <AccessControlContainer>
    <form @submit.prevent="onSubmit">
      <TextStyled
        text="Insira o seu email. Caso esteja cadastrado, enviaremos um link para você voltar a acessar a sua conta."
        className="gray-text"
        width="22.5rem"
        height="3rem"
      />
      <InputStyled
        v-model="email"
        type="email"
        id="email"
        width="22.5rem"
        height="2.8rem"
        placeholder="Digite seu email"
        borderColor="transparent"
        :handleChange="handleEmail"
        :error="errorEmail"
      />

      <ButtonStyled
        type="submit"
        v-show="!awaiting"
        className="login-button"
        label="Enviar"
        width="22.5rem"
        height="2.8rem"
      />
    </form>
    <nav>
      <RouterLink :to="{ name: 'signIn' }">
        <ButtonStyled
          className="transparent-button-blue-text"
          label="Voltar ao login"
        />
      </RouterLink>
    </nav>
  </AccessControlContainer>
</template>

<style scoped>
form {
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  height: 17rem;
  justify-content: space-around;
  gap: 5px;
  :first-child {
    text-align: center;
  }
}

nav {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}
</style>
