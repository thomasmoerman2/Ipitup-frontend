<template>
  <h1 class="text-xl font-bold mb-2">Welkom terug</h1>
  <p class="mb-6">New bij Ipitup? <RouterLink to="/register" class="text-blue-54">Maak een account</RouterLink>
  </p>

  <form class="flex flex-col gap-6" @submit.prevent="login">
    <AppInput label="E-mail" placeholder="Voeg uw e-mail in" type="text" :disabled="isLoading" value="jefke@mail.be" @update:value="set_email" />

    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" :disabled="isLoading" @update:value="set_password" />

    <div class="flex items-center gap-1 flex-wrap">
      <AppCheckbox title="Mij herinneren" />
      <RouterLink to="/forgot-password" class="text-blue-54 text-xs">Wachtwoord vergeten?</RouterLink>
    </div>

    <AppButton text="Inloggen" version="primary" icon="false" :disabled="isLoading" />
  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
import { ref } from 'vue';

if (localStorage.getItem('loggedIn')) {
  window.location.href = '/';
}

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const fetch_login = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      },
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

const set_email = (value) => {
  email.value = value;
}

const set_password = (value) => {
  password.value = value;
}

const login = async () => {
  try {
    if (email.value === '' || password.value === '') {
      console.warn('Email or password is empty');
    } else {
      isLoading.value = true;
      const response = await fetch_login();
      console.log(response);

      //check if response has token
      if (response.status === 200) {
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userId', response.userId);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error('Login failed');
      }
    }
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
