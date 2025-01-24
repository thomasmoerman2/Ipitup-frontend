<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/profile" class="flex items-center gap-1">
      <AppIcon name="ArrowLeft" :size="24" />
      <p class="font-medium text-[1.25rem]">Back</p>
    </RouterLink>
    <AppNotification ref="notification" />

    <AppToggle name="followType" v-model="selectedTab" type="radio" :items="['Volgend', 'Volgers']" @update:modelValue="handleTabChange" />

    <AppInput placeholder="Search" type="text" icon="search" v-model="searchQuery" @input="handleSearch" />

    <div class="flex flex-col gap-4">
      <div v-for="user in results" :key="String(user.id)" class="flex items-center justify-between">
        <SearchProfile 
          :id="String(user.id)" 
          :avatar="user.avatar" 
          :fullname="user.firstname + ' ' + user.lastname" 
          :firstname="user.firstname" 
          :showUsername="false"
        />

        <AppSmallButton v-if="selectedTab === 'Volgend'" @click="unfollowUser(user.id)" icon="UserRoundMinus" version="orange" text="Ontvolgen" />
        
        <AppSmallButton v-if="selectedTab === 'Volgers'" @click="removeFollower(user.id)"  icon="X" version="orange" text="Verwijder" />
      </div>

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
import AppNotification from "@/components/App/Notification.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";

const route = useRoute();
const selectedTab = ref(route.query.tab || 'Volgend');
const searchQuery = ref('');
const profileName = ref('');
const results = ref([]);
const notification = ref(null);

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

const removeFollower = async (followerId) => {
  try {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      console.error('Authentication token is missing.');
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/follow/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        FollowerId: followerId,
        FollowingId: Cookies.get('userId')
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove follower');
    }

    console.log('Follower removed successfully:', data.message);
    notification.value?.addNotification(
      'Volger verwijderd',
      'Deze volger is succesvol verwijderd.',
      'success'
    );
    // Verwijder de volger uit de lijst
    results.value = results.value.filter(user => user.id !== followerId);

  } catch (error) {
    console.error('Error removing follower:', error.message);
  }
};

const unfollowUser = async (followingId) => {
  try {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      console.error('Authentication token is missing.');
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/unfollow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        "followerId": Cookies.get('userId'),
        "followingId": followingId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to unfollow user');
    }

    console.log('User unfollowed successfully:', data.message);
    notification.value?.addNotification(
      'Ontvolgd',
      'Je volgt deze gebruiker niet meer.',
      'success'
    );

    // Verwijder de gebruiker uit de lijst
    results.value = results.value.filter(user => user.id !== followingId);

  } catch (error) {
    console.error('Error unfollowing user:', error.message);
  }
};


</script>
