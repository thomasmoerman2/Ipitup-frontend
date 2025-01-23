<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/profile" class="flex items-center gap-1">
      <AppIcon name="ArrowLeft" size="24" />
      <p class="font-medium text-[1.25rem]">Back</p>
    </RouterLink>

    <h1 class="font-bold text-xl">{{ profileName }}</h1>

    <AppToggle name="followType" v-model="selectedTab" type="radio" :items="['Volgend', 'Volgers']" @update:modelValue="handleTabChange" />

    <AppInput placeholder="Search" type="text" icon="search" v-model="searchQuery" @input="handleSearch" />

    <div class="flex flex-col gap-4">
      <SearchProfile v-for="user in filteredUsers" :key="user.id" :id="user.id" :img="user.img" :name="user.name" :username="user.username" />
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
const users = ref([]);
const profileName = ref('');

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
    users.value = data.map((user) => ({
      id: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      img: user.profileImage
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  }
};

const handleTabChange = (value) => {
  selectedTab.value = value;
  fetchUsers();
};

const handleSearch = () => {};

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter((user) => user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query));
});
</script>
