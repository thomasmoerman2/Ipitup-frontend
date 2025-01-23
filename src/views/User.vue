<template>
  <div class="flex flex-col justify-between gap-10">
    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ error }}
    </div>

    <!-- Gebruiker Informatie -->
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar :src="userData?.avatar" />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">Jefke</p>
        <p class="text-xs">@Jefke1998</p>
        <div class="flex pt-2.5">
          <p class="text-2xs italic text-black-50">Gebruiker sinds&nbsp;</p>
          <p class="text-2xs italic text-blue-36">{{ userData?.joinDate }}</p>
        </div>
      </div>
      <AppSmallButton icon="User" version="blue" text="Volgen" />
    </div>

    <!-- Recente Activiteiten -->
    <div class="flex flex-col gap-5">
      <p class="text-xs">Recente activiteiten</p>
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
    </div>

    <!-- Toggle: Badges / Leaderboard -->
    <div class="flex flex-col gap-3">
      <div class="flex justify-between mx-8">
        <button @click="activeTab = 'badges'" :class="['text-sm', activeTab === 'badges' ? 'font-bold underline underline-offset-8' : 'text-black-50']">
          Badges
        </button>
        <button @click="activeTab = 'leaderboard'" :class="['text-sm', activeTab === 'leaderboard' ? 'font-bold underline underline-offset-8' : 'text-black-50']">
          Leaderboard
        </button>
      </div>

      <!-- Badges Sectie -->
      <div v-if="activeTab === 'badges'" class="flex flex-col full-width-section bg-black-8 pb-5">
        <div class="flex my-5 justify-center items-center text-xs">
          <p>
            <strong>Jefke</strong>&nbsp;heeft momenteel&nbsp;<strong>6</strong>&nbsp;actieve badges.
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-2">
          <AppBadge exercise="Pushup" amount="100" />
          <AppBadge exercise="Squat" amount="500" />
          <AppBadge exercise="Pullup" amount="200" />
          <AppBadge exercise="Situp" amount="50" />
        </div>
      </div>

      <!-- Leaderboard Sectie -->
      <div v-if="activeTab === 'leaderboard'" class="flex flex-col full-width-section bg-black-8 pb-5">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" size="24" />
            <p class="text-3xl font-bold">9624</p>
          </div>
          <p>3de Plaats</p>
          <AppSmallButton version="blue" text="Bekijk op leaderboard" />
        </div>

        <div class="flex flex-col gap-[0.3125rem]">
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" position="1" name="Jefke" amount="9739" />
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" me="true" position="2" name="Pietjepuk" amount="9739" />
        </div>

        <div class="flex my-5 justify-center items-center text-xs">
          <p>
            Je staat&nbsp;<strong>115</strong>&nbsp;punten achter&nbsp;<strong>Jefke</strong>!&nbsp;Ga ervoor!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppIcon from "@/components/App/Icon.vue";
import WorkoutRecent from "@/components/Workout/Recent.vue";
import AppBadge from "@/components/App/Badge.vue";
import AppLeaderboardPosition from "@/components/App/LeaderboardPosition.vue";

const route = useRoute();
const userData = ref(null);
const error = ref(null);

const fetchUserData = async () => {
  try {
    error.value = null;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/info/${route.params.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    userData.value = data;
  } catch (e) {
    console.error('Error fetching user data:', e);
    error.value = 'Er is een fout opgetreden bij het ophalen van de gebruikersgegevens.';
    userData.value = null;
  }
}

onMounted(async () => {
  await fetchUserData();
});

// Toggle tussen Badges en Leaderboard
const activeTab = ref('badges');
</script>

<style scoped>
.full-width-section {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
