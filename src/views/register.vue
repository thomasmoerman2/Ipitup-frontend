<template>
  <h1 class="text-xl font-bold mb-2">Maak nu een account</h1>
  <p class="mb-6">Heb je al een account? <RouterLink to="/login" class="text-blue-54">Log in</RouterLink>
  </p>

  <form class="flex flex-col gap-6" @submit.prevent="handleRegister">
    <AppInput label="Voornaam" placeholder="Voeg uw voornaam in" type="text" :disabled="isLoading" @update:value="set_firstName" />
    <AppInput label="Achternaam" placeholder="Voeg uw achternaam in" type="text" :disabled="isLoading" @update:value="set_lastName" />
    <AppInput label="E-mail" placeholder="Voeg uw e-mail in" type="email" :disabled="isLoading" @update:value="set_email" />
    <AppInput label="Wachtwoord" placeholder="Voeg uw wachtwoord in" type="password" :disabled="isLoading" @update:value="set_password" />
    <AppInput label="Geboortedatum" class="text-black-40" :placeholder="placeholder" type="date" :disabled="isLoading" @update:value="set_dateOfBirth" />

    <div class="flex flex-col gap-2">
      <p class="text-sm">Zichtbaarheid</p>
      <div class="flex gap-2">
        <AppToggle name="visibility" :modelValue="visibility" type="radio" :items="['Publiek', 'Privé']" @update:modelValue="set_visibility" />
      </div>
      <p class="text-xs text-black-40">Je account is <span class="font-bold lowercase">{{ visibility }}</span></p>
    </div>

    <AppCheckbox title="Ik ga akkoord met de " url="/terms" titleUrl="Terms & Conditions" @update:modelValue="set_isChecked" />
    <AppNotification ref="notification" />
    <AppButton text="Register" version="primary" icon="false" :disabled="isLoading || !isFormValid" />

  </form>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
import AppToggle from '@/components/App/Toggle.vue';
import AppNotification from '@/components/App/Notification.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const notification = ref(null);
const router = useRouter();

onMounted(() => {
  // Check if user is already logged in
  const authToken = Cookies.get('authToken');
  if (authToken) {
    router.push('/')
  }
})

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

const isFormValid = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    dateOfBirth.value.trim() !== '' &&
    isChecked.value
  );
});

const clearAllCookies = () => {
  Cookies.remove('authToken');
  Cookies.remove('userId');
  Cookies.remove('userFirstname');
  Cookies.remove('userLastname');
  Cookies.remove('userEmail');
  Cookies.remove('accountStatus');
  Cookies.remove('isAdmin');
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: firstName.value,
        lastname: lastName.value,
        email: email.value,
        password: password.value,
        birthDate: dateOfBirth.value,
        accountStatus: visibility.value === 'Publiek' ? 0 : 1
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    // Set auth token first
    try {
      Cookies.set('authToken', data.authToken)
    } catch (error) {
      console.error('Failed to set auth token:', error)
      throw new Error('Failed to set authentication token')
    }

    // Then set user data
    try {
      //logs data received from server
      console.log("Data received from server:", data);

      Cookies.set("userId", data.body.userId)
      Cookies.set("userFirstname", data.body.firstname)
      Cookies.set("userLastname", data.body.lastname)
      Cookies.set("userEmail", data.body.email)
      Cookies.set("accountStatus", data.body.accountStatus)
      Cookies.set("isAdmin", data.body.isAdmin || false)

      setTimeout(() => {
        window.location.reload();
      }, 250);
    } catch (error) {
      console.error('Failed to set user data:', error)
      clearAllCookies()
      throw new Error('Failed to set user data')
    }
  } catch (error) {
    console.error('Registration error:', error)
    clearAllCookies()  // Clear any partial data on error
    notification.value?.addNotification(
      'Registratie mislukt',
      error.message || 'Er ging iets mis bij het registreren',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}
</script>