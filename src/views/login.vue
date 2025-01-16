<template>
  <h1 class="text-xl font-bold mb-2">Welkom terug</h1>
  <p class="mb-6">New bij Ipitup? <RouterLink to="/register" class="text-blue-54">Maak een account</RouterLink>
  </p>

  <form class="flex flex-col gap-6">
    <AppInput label="Gebruikersnaam of e-mail" placeholder="Voeg uw gebruikersnaam of e-mail in" type="text" />

    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" />

    <div class="flex items-center justify-between">
      <AppCheckbox title="Mij herinneren" />
      <RouterLink to="/forgot-password" class="text-blue-54 text-sm">Wachtwoord vergeten?</RouterLink>
    </div>

    <AppButton text="Inloggen" version="primary" icon="false" />
  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
</script>
