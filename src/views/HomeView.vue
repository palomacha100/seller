<script setup lang="ts">
import SignIn from '@/components/SignIn.vue'
</script>

<template>
  <main>
    <div class="background-styled">
      <SignIn />
    </div>
  </main>
</template>

<style scoped>
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
