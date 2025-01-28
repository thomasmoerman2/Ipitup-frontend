<template>
  <div class="flex flex-col justify-between gap-10">
    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ error }}
    </div>

    <!-- Gebruiker Informatie -->
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar v-if="userData?.userId" :src="userData.avatar" :id="String(userData.userId)" />
      <div class="flex flex-col items-center">
        <p class="font-bold">{{ userData?.firstname }} {{ userData?.lastname }}</p>
        <div class="flex pt-2.5">
          <p class="text-2xs italic text-blue-36">{{ userData?.createdAt }}</p>
        </div>
      </div>
      <AppDialog type="welcomer" :title="userData?.accountStatus === 1 ? 'Volg verzoeken' : 'Volgen'" icon="User" v-if="!Cookies.get('userId')" />
      <div v-else>
        <AppSmallButton v-if="!userData?.isFollowing" icon="User" :version="userData?.isPending ? 'orange' : 'blue'" :text="!userData?.isPending ? 'Volgen' : 'Verzoek annuleren'" @click="func_isFollowing()" />
        <AppSmallButton v-else icon="UserRoundMinus" version="orange" text="Ontvolgen" @click="func_isFollowing()" />
      </div>
    </div>

    <div class="flex flex-col items-center gap-2" v-if="userData?.accountStatus === 1 && !userData?.isFollowing">
      <AppIcon name="Lock" :size="24" :color="userData?.accountStatus === 0 ? 'text-blue-54' : 'text-black-50'" />
      <p class="text-xs">Deze gebruiker is <strong class="text-blue-54">privé</strong></p>
    </div>

    <!-- Recente Activiteiten -->
    <div class="flex flex-col gap-5" v-if="userData?.accountStatus === 0 || userData?.isFollowing">
      <p class="text-xs">Recente activiteiten</p>
      <WorkoutRecent v-for="workout in userData?.exercises" :key=String(workout.id) :img="getExerciseImage(workout.type)" :title="workout.name" :level="workout.type" :time=String(workout.time) :amount=String(workout.score) />
    </div>

    <!-- Toggle: Badges / Leaderboard -->
    <div class="flex flex-col gap-3" v-if="userData?.accountStatus === 0 || userData?.isFollowing">
      <div class="flex justify-between mx-8">
        <button @click="activeTab = 'badges'" :class="['text-sm', activeTab === 'badges' ? 'font-bold underline underline-offset-8' : 'text-black-50']">
          Badges
        </button>
        <button @click="activeTab = 'leaderboard'" :class="['text-sm', activeTab === 'leaderboard' ? 'font-bold underline underline-offset-8' : 'text-black-50']">
          Leaderboard
        </button>
      </div>

      <!-- Badges Sectie -->
      <div v-if="activeTab === 'badges' && (userData?.accountStatus === 0 || userData?.isFollowing)" class="flex flex-col full-width-section bg-black-8 pb-5">
        <div class="flex my-5 justify-center items-center text-xs">
          <p>
            <strong>{{ userData?.firstname }}</strong>&nbsp;heeft momenteel&nbsp;<strong>{{ userData?.achievements.length }}</strong>&nbsp;actieve badges.
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-2">
          <AppBadge v-for="badge in userData?.achievements" :key="badge.id" :exercise="badge.name" :amount="badge.amount" />
        </div>
      </div>

      <!-- Leaderboard Sectie -->
      <div v-if="activeTab === 'leaderboard' && Cookies.get('userId') && (userData?.accountStatus === 0 || userData?.isFollowing)" class="flex flex-col full-width-section bg-black-8 pb-5">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" :size="24" />
            <p class="text-3xl font-bold">{{ userData?.leaderboard.score }}</p>
          </div>
          <AppSmallButton version="blue" text="Bekijk op leaderboard" @click="router.push('/podium')" />
        </div>

        <div class="flex flex-col gap-[0.3125rem]">
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" :position="1" :name="leaderboardPosition[0].name" :amount="Number(leaderboardPosition[0].amount)" />
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" me="true" :position="2" :name="leaderboardPosition[1].name" :amount="Number(leaderboardPosition[1].amount)" />
        </div>

        <div class="flex my-5 justify-center items-center text-xs">
          <p>
            Je staat
            <strong>{{
              Math.abs(Number(leaderboardPosition[0].amount) - Number(leaderboardPosition[1].amount))
            }}</strong>&nbsp;punten
            {{
              leaderboardPosition[0].name === Cookies.get("userFirstname")
                ? "voor"
                : "achter"
            }}
            <strong>{{
              leaderboardPosition[0].name === Cookies.get("userFirstname")
                ? leaderboardPosition[1].name
                : leaderboardPosition[0].name
            }}</strong>!&nbsp;Ga ervoor!
          </p>

        </div>
      </div>

      <!-- Leaderboard if user not logged in -->
      <div v-if="activeTab === 'leaderboard' && !Cookies.get('userId') && userData?.accountStatus === 0" class="flex flex-col full-width-section bg-black-8 pb-5">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" size="24" />
            <p class="text-3xl font-bold">{{ userData?.leaderboard.score }}</p>
          </div>
          <AppSmallButton version="blue" text="Log in om je positie te zien" />
        </div>

        <div class="flex flex-col gap-[0.3125rem]">
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" :position="1" :name="leaderboardPosition[0].name" :amount="leaderboardPosition[0].amount" />
          <div class="bg-black-20 rounded-md mx-8 px-4 py-3">
            <p class="text-sm text-black-50">Log in om je positie te zien</p>
          </div>
        </div>

        <div class="flex my-5 justify-center items-center text-xs">
          <p>
            Log in om je positie te zien en je score te vergelijken met anderen!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppIcon from "@/components/App/Icon.vue";
import WorkoutRecent from "@/components/Workout/Recent.vue";
import AppBadge from "@/components/App/Badge.vue";
import AppDialog from "@/components/App/Dialog.vue";
import AppLeaderboardPosition from "@/components/App/LeaderboardPosition.vue";
import Cookies from 'js-cookie';
const route = useRoute();
const router = useRouter();

const userData = ref(null);
const error = ref(null);
const leaderboardPosition = ref(null);

if (Cookies.get('userId') == route.params.id) {
  router.push('/profile');
}

const fetchUserData = async () => {
  try {
    error.value = null;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/info/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    userData.value = data;

    if (userData.value.accountStatus === 0 || userData.value.isFollowing) {
      leaderboardPosition.value = [
        {
          name: userData.value.firstname,
          amount: userData.value.leaderboard.score,
        },
        {
          name: Cookies.get("userFirstname"),
          amount: Cookies.get("userLeaderboardScore") || 0,
        },
      ];
      leaderboardPosition.value.sort((a, b) => b.amount - a.amount);
    }

    if (userData.value.isPending) {
      userData.value.isFollowing = false;
      userData.value.isPending = true;
    }
  } catch (e) {
    console.error('Error fetching user data:', e);
    error.value = 'Er is een fout opgetreden bij het ophalen van de gebruikersgegevens.';
    userData.value = null;
  }
}

const func_isFollowing = () => {
  if (Cookies.get('userId')) {
    if (userData.value.isFollowing || userData.value.isPending) {
      fetchUnfollowUser();
    } else {
      fetchFollowUser();
    }
  } else {

  }
}

const fetchFollowUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
      body: JSON.stringify({
        "followerId": Cookies.get('userId'),
        "followingId": route.params.id,
        "status": userData.value.accountStatus === 0 ? 'Accepted' : 'Pending'
      }),
    });

    if (response.ok) {
      if (userData.value.accountStatus === 1) {
        userData.value.isFollowing = false;
        userData.value.isPending = true;
      } else {
        userData.value.isFollowing = true;
        userData.value.isPending = false;
      }
    }

  } catch (e) {
    console.error('Error fetching user data:', e);
  }
}

const fetchUnfollowUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/unfollow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
      body: JSON.stringify({
        "followerId": Cookies.get('userId'),
        "followingId": route.params.id,
      }),
    });

    if (response.ok) {
      userData.value.isFollowing = false;
      userData.value.isPending = false;
    }

  } catch (e) {
    console.error('Error fetching user data:', e);
  }
}

onMounted(async () => {
  await fetchUserData();
});

// Toggle tussen Badges en Leaderboard
const activeTab = ref('badges');



const getExerciseImage = (exerciseType) => {
  return `/workoutimages/${exerciseType.toLowerCase()}.png`;
};


</script>

<style scoped>
.full-width-section {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
