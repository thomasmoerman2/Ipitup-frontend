<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-[50vh]">
    <p>Loading...</p>
  </div>

  <div v-else-if="error" class="flex justify-center items-center min-h-[50vh]">
    <p class="text-red-500">{{ error }}</p>
  </div>

  <div v-else class="flex flex-col justify-between gap-10">
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar :src="userData?.avatar" />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">{{ userData?.username }}</p>
        <p class="text-xs">@{{ userData?.handle }}</p>
        <div class="flex pt-2.5">
          <p class="text-2xs italic text-black-50">Gebruiker sinds&nbsp;</p>
          <p class="text-2xs italic text-blue-36">{{ userData?.joinDate }}</p>
        </div>
      </div>
      <AppSmallButton icon="User" version="blue" text="Volgen" />
    </div>

    <div class="flex flex-col gap-5">
      <p class="text-xs">Recente activiteiten</p>
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex justify-between mx-8">
        <p>Badges</p>
        <p class="underline underline-offset-8">Leaderboard</p>
      </div>

      <div class="flex flex-col full-width-section bg-black-8">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" size="24" />
            <p class="text-3xl font-bold">9624</p>
          </div>
          <p>3de Plaats</p>
          <AppSmallButton version="blue" text="Bekijk op leaderboard" />
        </div>
        <div class="flex flex-col gap-[0.3125rem]">
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" position="1" name="Pietjepuk" amount="9739" />
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" me="true" position="2" name="Thibo" amount="9739" />
        </div>

        <p class="text-center text-xs pt-1 pb-5">
          Je staat 115 punten achter Thibo! Ga ervoor!
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppIcon from "@/components/App/Icon.vue";
import WorkoutRecent from "@/components/Workout/Recent.vue";
import AppLeaderboardPosition from "@/components/App/LeaderboardPosition.vue";

// Get route and ID parameter
const route = useRoute();
const userId = ref(route.params.id);

// Add user data ref
const userData = ref(null);
const isLoading = ref(false);
const error = ref(null);

// // Function to fetch user data
// const fetchUserData = async (id) => {
//   if (!id) return;

//   isLoading.value = true;
//   try {
//     // Replace this with your actual API call
//     const response = await fetch(`/api/users/${id}`);
//     if (!response.ok) throw new Error('User not found');

//     userData.value = await response.json();
//   } catch (err) {
//     error.value = err.message;
//   } finally {
//     isLoading.value = false;
//   }
// };

// Watch for route changes
watch(() => route.params.id, (newId) => {
  userId.value = newId;
  // fetchUserData(newId);
});

// Initial fetch
onMounted(() => {
  // fetchUserData(userId.value);
});
</script>

<style scoped>
.full-width-section {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
