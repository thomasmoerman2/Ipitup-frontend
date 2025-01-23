<template>
  <div class="flex flex-col justify-between gap-10">
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar :id="Cookies.get('userId')" />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">{{ userData.firstname }} {{ userData.lastname }}</p>
        <p class="text-xs">{{ userData.username }}</p>
      </div>

      <div class="flex gap-8 items-center">
        <RouterLink :to="{ path: '/profile/following', query: { tab: 'Volgend' } }" class="flex flex-col items-center cursor-pointer hover:text-blue-54 transition-colors">
          <p class="text-xs">{{ userData.following }}</p>
          <p class="text-xs text-black-40">volgend</p>
        </RouterLink>
        <div class="h-8 w-[1px] bg-black-20"></div>
        <RouterLink :to="{ path: '/profile/following', query: { tab: 'Volgers' } }" class="flex flex-col items-center cursor-pointer hover:text-blue-54 transition-colors">
          <p class="text-xs">{{ userData.followers }}</p>
          <p class="text-xs text-black-40">volgers</p>
        </RouterLink>
      </div>

      <RouterLink to="/profile/settings">
        <AppSmallButton version="blue" text="Profiel bewerken" />
      </RouterLink>
    </div>

    <div class="flex justify-around w-full">
      <ProfileInfo icon="Award" text="Badges" :amount="isLoading ? 'Laden...' : String(userData.badgeCount)" />
      <ProfileInfo icon="RefreshCw" text="Oefeningen" :amount="isLoading ? 'Laden...' : String(userData.activitiesCount)" />
      <ProfileInfo icon="Gem" text="Punten" :amount="isLoading ? 'Laden...' : String(userData.totalscore)" />
    </div>

    <div>
      <p class="font-bold">Moving time</p>
      <div class="w-fit whitespace-nowrap py-3">
        <AppOptions :options="[
          { text: 'Deze week', value: 'Deze week' },
          { text: 'Deze maand', value: 'Deze maand' },
        ]" v-model="selectedOption" @change="handleOptionChange" />
      </div>
      <div class="flex w-full bg-blue-6 h-[10rem] justify-center items-center text-center">[Grafiek]</div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <p class="font-bold w-full">Badges</p>
      <div class="flex flex-wrap justify-center gap-2">
        <AppBadge v-for="badge in userBadges.slice(0, 8)" :key="badge.badgeId" :exercise="badge.badgeName" :amount="Number(badge.badgeAmount)" />
      </div>
      <RouterLink to="/badges">
        <AppSmallButton version="blue" text="Alle badges" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import SettingsAvatar from '@/components/Settings/Avatar.vue';
import AppSmallButton from '@/components/App/SmallButton.vue';
import ProfileInfo from '@/components/Profile/Info.vue';
import AppOptions from '@/components/App/Options.vue';
import AppBadge from '@/components/App/Badge.vue';
import AppIcon from '@/components/App/Icon.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const router = useRouter();
const selectedOption = ref('1');
const userBadges = ref([]);
const isLoading = ref(false);

const userData = ref({
  firstname: Cookies.get('userFirstname') || '',
  lastname: Cookies.get('userLastname') || '',
  email: Cookies.get('userEmail') || '',
  username: '@' + (Cookies.get('userFirstname') || '').toLowerCase(),
  accountStatus: Cookies.get('accountStatus') || 'Private',
  totalscore: Number(Cookies.get('totalScore')) || 0,
  activitiesCount: Number(Cookies.get('activitiesCount')) || 0,
  badgeCount: Number(Cookies.get('badgeCount')) || 0,
  followers: Number(Cookies.get('followers')) || 0,
  following: Number(Cookies.get('following')) || 0,
});

const handleOptionChange = (option) => {
  console.log('Selected option:', option);
};

onMounted(async () => {
  if (!Cookies.get('authToken')) {
    router.push('/login');
  } else {
    await fetchUserTotalScore();
    await fetchUserActivitiesCount();
    await fetchUserBadgeCount();
    await fetchUserBadges();
    await fetchUserFollowers();
    await fetchUserFollowing();
  }
});

const fetchUserTotalScore = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/totalscore/${userId}`);
    const data = await response.json();
    if (data && typeof data.totalScore === 'number') {
      Cookies.set('totalScore', data.totalScore, { expires: 1 }); // Sla altijd op en vernieuw cookie
      userData.value.totalscore = data.totalScore;
    }
  } catch (error) {
    console.error('Error fetching total score:', error);
  }
};

const fetchUserActivitiesCount = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity/user/total/${userId}`);
    const data = await response.json();
    if (data && typeof data.count === 'number') {
      Cookies.set('activitiesCount', data.count, { expires: 1 }); // Sla altijd op en vernieuw cookie
      userData.value.activitiesCount = data.count;
    }
  } catch (error) {
    console.error('Error fetching activity count:', error);
  }
};

const fetchUserBadgeCount = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badge/user/${userId}`);
    const data = await response.json();
    if (data && typeof data.count === 'number') {
      Cookies.set('badgeCount', data.count, { expires: 1 }); // Sla in cookies op
      userData.value.badgeCount = data.count; // Update de state
    }
  } catch (error) {
    console.error('Error fetching badge count:', error);
  }
};

const fetchUserBadges = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badge/user/${userId}`);
    const data = await response.json();

    if (data && Array.isArray(data.badges)) {
      userBadges.value = data.badges;
      console.log('Fetched badges: ', userBadges.value);
    } else {
      console.warn('No badges found');
    }
  } catch (error) {
    console.error('Error fetching badges:', error);
  }
};

const fetchUserFollowers = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}/followers`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    });
    const data = await response.json();
    if (data && typeof data.count === 'number') {
      Cookies.set('followers', data.count, { expires: 1 });
      userData.value.followers = data.count ? data.count : 0;
    }
  } catch (error) {
    console.error('Error fetching followers count:', error);
  }
};

const fetchUserFollowing = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}/following`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    });
    const data = await response.json();
    if (data && typeof data.count === 'number') {
      Cookies.set('following', data.count, { expires: 1 });
      userData.value.following = data.count ? data.count : 0;
    }
  } catch (error) {
    console.error('Error fetching following count:', error);
  }
};
</script>
