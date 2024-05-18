<script lang="ts">
import { defineComponent } from 'vue'
import ButtonStyled from './ButtonStyled.vue'
import TextStyled from './TextStyled.vue'
import ImageStyled from './ImageStyled.vue'

export default defineComponent({
  components: {
    ButtonStyled,
    TextStyled,
    ImageStyled
  },
  data() {
    return {
      showForm: false,
      showButton: true,
      botaoTexto: 'Começar',
      backgroundStyledClass: '',
      imageStyledClass: '',
      textStyledClass: '',
      buttonStyledClass: ''
    }
  },
  methods: {
    exibirFormulario() {
      ;(this.showForm = true),
        (this.showButton = false),
        (this.backgroundStyledClass = 'background-styled-clicked')
      this.imageStyledClass = 'image-styled-clicked'
      this.textStyledClass = 'text-styled-clicked'
      this.buttonStyledClass = 'button-styled-clicked'
    },
    fecharFormulario() {
      ;(this.showForm = false), (this.showButton = true), (this.backgroundStyledClass = '')
      this.imageStyledClass = ''
      this.imageStyledClass = ''
      this.buttonStyledClass = ''
    }
  }
})
</script>
<template>
  <div class="main-container">
    <div class="background-styled" :class="backgroundStyledClass">
      <div class="apresentation-container">
        <ImageStyled
          imageUrl="../../images/light-logo.png"
          altText="Logo com nome do app Link to Food"
          width="25rem"
          :class="imageStyledClass"
        />
        <TextStyled
          className="main-text"
          text="Conecte sua loja a milhões de novos clientes, 
          expanda sua área de entrega e aumente suas vendas significativamente."
          width="28rem"
          height="15rem"
          :class="textStyledClass"
        />
        <ButtonStyled
          @click="exibirFormulario"
          className="login-button"
          type="button"
          label="Começar"
          width="10rem"
          height="2.8rem"
          class="button-styled-clicked"
          :class="{ leave: !showButton }"
        />
      </div>
    </div>

    <div class="form-container" v-if="showForm" @fecharFormulario="fecharFormulario">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.background-styled {
  height: 100vh;
  width: 100%;
  background-image: url('../../images/image2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  opacity: 0.9;
  align-items: center;
}

.background-styled-clicked {
  width: 50%;
  height: 100vh;
  animation: expandBackground 0.5s forwards;
  transform: translateX(100%);
  opacity: 1;
}

@keyframes expandBackground {
  from {
    width: 100%;
    transform: translateX(100%);
  }
  to {
    width: 50%;
    transform: translateX(0);
  }
}

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
  transform: translateY(100%);
  animation: slideInFromBottom 0.5s forwards;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-container.leave {
  opacity: 0;
  transform: translateY(100%);
}

.apresentation-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 35rem;
  height: 30rem;
}

.image-styled-clicked {
  animation: expandBackground 0.5s forwards;
}

.text-styled-clicked {
  font-size: 1.2rem;
  animation: expandBackground 0.5s forwards;
}

.button-styled-clicked.leave {
  animation: fadeOutAndSlideUp 0.5s forwards;
}

@keyframes fadeOutAndSlideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>

<style>
.main-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
