<template>
  <h1 class="text-xl font-bold mb-2">Welkom terug</h1>
  <p class="mb-6">New bij Ipitup? <RouterLink to="/register" class="text-blue-54">Maak een account</RouterLink>
  </p>

  <form class="flex flex-col gap-6">
    <AppInput label="E-mail" placeholder="Voeg uw e-mail in" type="text" v-model="email" :disabled="isLoading" value="jefke@mail.be" />

    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" v-model="password" :disabled="isLoading" />

    <div class="flex items-center gap-1 flex-wrap">
      <AppCheckbox title="Mij herinneren" />
      <RouterLink to="/forgot-password" class="text-blue-54 text-xs">Wachtwoord vergeten?</RouterLink>
    </div>

    <AppButton text="Inloggen" version="primary" icon="false" @click="login" :disabled="isLoading" />
  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const fetch_login = async () => {
  try {
    const response = await fetch('http://localhost:7071/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch login error:', error);
    throw error;
  }
}

const login = async () => {
  try {
    isLoading.value = true;
    const response = await fetch_login();
    console.log(response);
  } catch (error) {
    console.error('Login failed:', error);
    // Here you could add user feedback about the login failure
  } finally {
    isLoading.value = false;
  }
}
</script>
