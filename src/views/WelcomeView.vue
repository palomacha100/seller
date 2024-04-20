<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
</script>

<template>
  <main>
    <div class="form-container">
      <UserProfile />
    </div>
  </main>
</template>

<style scoped>
div {
  height: 100vh;
  width: 100%;
  background-image: url('../../images/pizza.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>

<style>
.form-container {
  display: flex;
  width: 27rem;
  height: 30rem;
  background-color: var(--yellow);
}
</style>
