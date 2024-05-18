<script setup lang="ts">
import TitleStyled from '@/components/TitleStyled.vue'
import TextStyled from '@/components/TextStyled.vue'
</script>

<template>
  <main>
    <TitleStyled title="Testando" />
    <TextStyled className="gray-text" text="admin@example.com" width="22.5rem" height="1rem" />
    <TextStyled
      className="red-text"
      text="Email ou senha incorretos. Confira-os."
      width="22.5rem"
      height="1rem"
    />
    <TextStyled className="white-bold-text" text="Entrar" width="22.5rem" height="1rem" />
    <TextStyled className="blue-bold-text" text="Esqueceu a senha?" width="22.5rem" height="1rem" />
    <TextStyled
      className="grey-bold-text"
      text="Não tem uma conta?"
      width="22.5rem"
      height="1rem"
    />
  </main>
</template>
