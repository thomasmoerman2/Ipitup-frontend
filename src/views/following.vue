<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/profile" class="flex items-center gap-1">
      <AppIcon name="ArrowLeft" :size="24" />
      <p class="font-medium text-[1.25rem]">Back</p>
    </RouterLink>

    <AppToggle name="followType" v-model="selectedTab" type="radio" :items="['Volgend', 'Volgers']" @update:modelValue="handleTabChange" />

    <AppInput placeholder="Search" type="text" icon="search" v-model="searchQuery" @input="handleSearch" />

    <div class="flex flex-col gap-4">
      <SearchProfile v-for="user in results" :key="String(user.id)" :id="String(user.id)" :avatar="user.avatar" :fullname="user.firstname + ' ' + user.lastname" :firstname="user.firstname" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AppIcon from '@/components/App/Icon.vue';
import AppToggle from '@/components/App/Toggle.vue';
import AppInput from '@/components/App/Input.vue';
import SearchProfile from '@/components/Search/Profile.vue';
import Cookies from 'js-cookie';

const route = useRoute();
const selectedTab = ref(route.query.tab || 'Volgend');
const searchQuery = ref('');
const profileName = ref('');
const results = ref([]);

onMounted(() => {
  const firstName = Cookies.get('userFirstname');
  const lastName = Cookies.get('userLastname');
  if (firstName && lastName) {
    profileName.value = `${firstName} ${lastName}`;
  }
  fetchUsers();
});

const fetchUsers = async () => {
  try {
    const userId = Cookies.get('userId');
    const authToken = Cookies.get('authToken');
    if (!userId || !authToken) return;

    const endpoint = selectedTab.value === 'Volgend' ? 'following' : 'followers';
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch users');

    const data = await response.json();
    results.value = data;
  } catch (error) {
    console.error('Error fetching users:', error);
    results.value = [];
  }
};

const handleTabChange = (value) => {
  selectedTab.value = value;
  fetchUsers();
};


const handleSearch = () => {
  if (searchQuery.value.trim() === '') {
    fetchUsers();
  } else {
    results.value = results.value.filter((user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
};

</script>
