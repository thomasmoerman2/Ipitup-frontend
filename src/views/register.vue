<template>
  <h1 class="text-xl font-bold mb-2">Maak nu een account</h1>
  <p class="mb-6">Heb je al een account? <RouterLink to="/login" class="text-blue-54">Log in</RouterLink>
  </p>

  <form class="flex flex-col gap-6">
    <AppInput label="Gebruikersnaam (kan later niet worden gewijzigd)" placeholder="@uw-gebruikersnaam" type="text" />
    <AppInput label="E-mail" placeholder="Voeg uw e-mail in" type="email" />
    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" />
    <AppInput label="Geboortedatum" placeholder="Selecteer uw geboortedatum" type="date" />


    <div class="flex flex-col gap-2">
      <p class="text-sm">Zichtbaarheid</p>
      <div class="flex gap-2">
        <AppButton text="Publiek" version="outline" icon="false" />
        <AppButton text="Privé" version="outline" icon="false" />
      </div>
      <p class="text-xs text-black-40">Je account is <span class="font-bold">openbaar</span></p>
    </div>

    <AppCheckbox title="Ik ga akkoord met de " url="/terms" titleUrl="Terms & Conditions" />

    <AppButton text="Register" version="primary" icon="false" />
  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
</script>
