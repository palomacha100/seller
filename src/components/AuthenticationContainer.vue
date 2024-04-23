<script setup lang="ts">
import ImageStyled from './ImageStyled.vue'
</script>

<template>
  <div class="background-styled">
    <div class="form-container">
      <ImageStyled
        imageUrl="../../images/logo.png"
        altText="Logo em azul com nome do app Link to Food"
        width="11.25rem"
      />
      <slot></slot>
    </div>
  </div>
</template>

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
