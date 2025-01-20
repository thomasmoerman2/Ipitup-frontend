<template>
  <h1 class="text-xl font-bold mb-2">Maak nu een account</h1>
  <p class="mb-6">Heb je al een account? <RouterLink to="/login" class="text-blue-54">Log in</RouterLink>
  </p>

  <form class="flex flex-col gap-6" @submit.prevent="fetch_register">
    <AppInput label="Voornaam" placeholder="Voeg uw voornaam in" type="text" :disabled="isLoading" @update:value="set_firstName" />
    <AppInput label="Achternaam" placeholder="Voeg uw achternaam in" type="text" :disabled="isLoading" @update:value="set_lastName" />
    <AppInput label="E-mail" placeholder="Voeg uw e-mail in" type="email" :disabled="isLoading" @update:value="set_email" />
    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" :disabled="isLoading" @update:value="set_password" />
    <AppInput label="Geboortedatum" placeholder="Selecteer uw geboortedatum" type="date" :disabled="isLoading" @update:value="set_dateOfBirth" />

    <div class="flex flex-col gap-2">
      <p class="text-sm">Zichtbaarheid</p>
      <div class="flex gap-2">
        <AppToggle name="visibility" :modelValue="visibility" type="radio" :items="['Publiek', 'Privé']" @update:modelValue="set_visibility" />
      </div>
      <p class="text-xs text-black-40">Je account is <span class="font-bold lowercase">{{ visibility }}</span></p>
    </div>

    <AppCheckbox title="Ik ga akkoord met de " url="/terms" titleUrl="Terms & Conditions" @update:modelValue="set_isChecked" />
    <AppNotification ref="notification" />
    <AppButton text="Register" version="primary" icon="false" :disabled="isLoading || !isChecked" />
  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
import AppToggle from '@/components/App/Toggle.vue';
import AppNotification from '@/components/App/Notification.vue';
import { ref } from 'vue';

const notification = ref(null);

if (localStorage.getItem('loggedIn')) {
  window.location.href = '/';
}

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const dateOfBirth = ref('');
const isLoading = ref(false);
const visibility = ref('Publiek');
const isChecked = ref(false);

const set_firstName = (value) => {
  firstName.value = value;
}

const set_lastName = (value) => {
  lastName.value = value;
}

const set_email = (value) => {
  email.value = value;
}

const set_password = (value) => {
  password.value = value;
}

const set_dateOfBirth = (value) => {
  dateOfBirth.value = value;
}

const set_visibility = (value) => {
  visibility.value = value;
}

const set_isChecked = (value) => {
  isChecked.value = value;
}

const fetch_register = async () => {
  try {
    // Reset any existing notification
    notification.value = { message: '', type: '' };
    isLoading.value = true;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        firstname: firstName.value,
        lastname: lastName.value,
        email: email.value,
        password: password.value,
        birthdate: dateOfBirth.value,
        accountstatus: visibility.value === 'Publiek' ? 'Public' : 'Private',
        avatar: "null"
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('userId', data.userId);
      window.location.href = '/';
    } else {
      notification.value.addNotification(
        'Registration failed',
        data.error || 'Registration failed. Please try again.',
        'error'
      );
    }
  } catch (error) {
    console.error(error);
    notification.value.addNotification(
      'Registration failed',
      'An unexpected error occurred. Please try again.',
      'error'
    );
  } finally {
    isLoading.value = false;
  }
}
</script>