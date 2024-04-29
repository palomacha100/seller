<script lang="ts">
import { defineComponent } from 'vue'
import ImageStyled from './ImageStyled.vue'

export default defineComponent({
  components: {
    ImageStyled
  }
})
</script>
<template>
  <div class="main-container">
    <div class="background-styled">
      <div class="apresentation-container">
        <ImageStyled
          imageUrl="../../images/light-logo.png"
          altText="Logo com nome do app Link to Food"
          width="25rem"
        />
      </div>
    </div>

    <div class="form-container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.background-styled {
  height: 100vh;
  width: 50%;
  background-image: url('../../images/image3.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  opacity: 0.9;
  align-items: center;
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
}

.main-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100vw;
  height: 100vh;
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
</style>
