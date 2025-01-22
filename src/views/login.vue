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
    <AppNotification ref="notification" />
    <AppButton text="Inloggen" version="primary" icon="false" :disabled="isLoading" />
  </form>

  <!-- Password Display Modal -->
  <div v-if="showNewPasswordModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-md w-full p-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Nieuw wachtwoord</h3>
      <div class="flex gap-2 mb-4">
        <input type="text" :value="newPassword" readonly class="flex-1 px-4 py-2 border rounded-lg bg-gray-50" />
        <button @click="copyPassword" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Kopiëren
        </button>
      </div>
      <div class="flex justify-end">
        <button @click="showNewPasswordModal = false" class="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors duration-200">
          Sluiten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppInput from '@/components/App/Input.vue';
import AppButton from '@/components/App/Button.vue';
import AppCheckbox from '@/components/App/Checkbox.vue';
import AppNotification from '@/components/App/Notification.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setAuthCookie, setUserCookies, clearAuthCookies, isAuthenticated } from '@/utils/auth';

const router = useRouter();
const notification = ref(null);

onMounted(() => {
  // Check if user is already logged in
  if (isAuthenticated()) {
    router.push('/')
  }
})

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const showNewPasswordModal = ref(false);
const newPassword = ref('');

const set_email = (value) => {
  email.value = value;
}

const set_password = (value) => {
  password.value = value;
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(newPassword.value)
    notification.value?.addNotification(
      'Gekopieerd',
      'Wachtwoord is gekopieerd naar het klembord',
      'success'
    )
    // Auto-dismiss notification after 2 seconds
    setTimeout(() => {
      notification.value?.clearNotifications()
    }, 2000)
  } catch (error) {
    notification.value?.addNotification(
      'Kopiëren mislukt',
      'Probeer het wachtwoord handmatig te kopiëren',
      'error'
    )
  }
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Check if we received a new password
      if (data.newPassword) {
        newPassword.value = data.newPassword
        showNewPasswordModal.value = true
        return
      }
      throw new Error(data.message || 'Login failed')
    }

    // Set auth token first
    const tokenSet = setAuthCookie(data.authToken)
    if (!tokenSet) {
      throw new Error('Failed to set authentication token')
    }

    // Then set user data
    const userDataSet = setUserCookies(data)
    if (!userDataSet) {
      // If user data fails to set, clear auth token
      clearAuthCookies()
      throw new Error('Failed to set user data')
    }

    console.log('Login successful, isAdmin:', data.isAdmin)
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    clearAuthCookies()  // Clear any partial data on error
    notification.value?.addNotification(
      'Login mislukt',
      error.message || 'Controleer je e-mail en wachtwoord',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}

// Update form submit handler
const login = handleLogin
</script>
