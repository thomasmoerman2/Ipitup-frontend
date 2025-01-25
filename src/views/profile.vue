<template>
  <div class="flex flex-col justify-between gap-10">
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar :id="Cookies.get('userId')" />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">{{ userData.firstname }} {{ userData.lastname }}</p>
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
          { text: 'Laatste 7 dagen', value: '7' },
          { text: 'Laatste 30 dagen', value: '30' },
        ]" v-model="selectedOption" @change="handleOptionChange" />
      </div>
      <div class="flex w-full bg-blue-6 h-max justify-center items-center text-center">
        <canvas v-if="userData.activitiesCount > 0" id="myChart" class="w-full h-full"></canvas>
        <p v-else class="text-center py-20">Geen activiteiten gevonden</p>
      </div>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import Chart from 'chart.js/auto';

let myChart;
const router = useRouter();
const selectedOption = ref('7');
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
  selectedOption.value = option;

  fetchUserActivitiesCount();
};

onMounted(async () => {
  if (!Cookies.get('authToken')) {
    router.push('/login');
  } else {
    await fetchUserTotalScore();
    await fetchUserActivitiesCount();
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
      userData.value.totalscore = data.totalScore || 0;
    }
  } catch (error) {

  }
};

const fetchUserActivitiesCount = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity/user/total/${userId}/${selectedOption.value}`);
    const data = await response.json();
    if (data) {
      Cookies.set('activitiesCount', data.count || 0, { expires: 1 }); // Sla altijd op en vernieuw cookie
      userData.value.activitiesCount = data.count || 0;
      userData.value.activitiesData = data.activities || [];



      if (userData.value.activitiesCount > 0) {
        func_set_chart();
      } else {

      }
    }
  } catch (error) {

    userData.value.activitiesData = [];
  }
};

const fetchUserBadges = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badge/user/${userId}`);
    const data = await response.json();

    if (data && Array.isArray(data.badges)) {
      userBadges.value = data.badges;
      userData.value.badgeCount = data.length ? data.length : 0;
    } else {

    }
  } catch (error) {

  }
};

const fetchUserFollowers = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/followers/${userId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    });
    const data = await response.json();
    userData.value.followers = data.followers.length;
  } catch (error) {

  }
};

const fetchUserFollowing = async () => {
  try {
    const userId = Cookies.get('userId');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/following/${userId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    });
    const data = await response.json();
    userData.value.following = data.following.length;
  } catch (error) {

  }
};

const func_set_chart = () => {
  if (myChart) {
    myChart.destroy();
  }
  if (!userData.value.activitiesData || userData.value.activitiesData.length === 0) {

    return;
  }

  const activitiesData = userData.value.activitiesData.reduce((acc, item) => {
    const date = new Date(item.activityDate).toLocaleDateString('nl-NL', { weekday: 'short', month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + item.activityScore;
    return acc;
  }, {});

  //for loop to get last 7 days and add 0 to the array if the date is not in the array
  const activitiesDataArray = [];
  for (let i = 0; i < selectedOption.value; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toLocaleDateString('nl-NL', { weekday: 'short', month: 'short', day: 'numeric' });

    const obj = {
      date: new Date(formattedDate),
      dateString: formattedDate,
      score: activitiesData[formattedDate] || 0
    }

    activitiesDataArray.push(obj);
  }
  activitiesDataArray.sort((a, b) => a.date - b.date);

  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: activitiesDataArray.map(item => item.dateString),
      datasets: [{
        label: 'Activity Score',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: activitiesDataArray.map(item => item.score)
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
</script>