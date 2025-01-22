<template>
  <!-- Filter Buttons -->
  <div class="flex gap-2 justify-center w-full">
    <button @click="openSort" class="flex items-center justify-center gap-2 bg-[#E8F8F8] text-blue-54 rounded-lg px-4 py-2 w-1/2">
      <AppIcon name="ChevronsUpDown" size="16" />
      <span class="text-sm">Sorteren op</span>
    </button>
    <button @click="openFilter" class="flex items-center justify-center gap-2 bg-[#E8F8F8] text-blue-54 rounded-lg px-4 py-2 w-1/2">
      <AppIcon name="Filter" size="16" />
      <span class="text-sm">Filter</span>
    </button>
  </div>

  <!-- Podium -->
  <div class="flex items-end justify-center">
    <div v-for="(winner, index) in podiumWinners" :key="winner.userId" class="flex flex-col items-center">
      <SettingsAvatar class="mb-2.5 max-w-16 max-h-16" />
      <p class="text-xs">{{ winner.firstname }} {{ winner.lastname }}</p>
      <div class="flex items-center gap-1 mb-4">
        <AppIcon name="Gem" size="10" color="text-blue-54" />
        <p class="text-xs font-bold text-blue-54">{{ winner.totalScore }}</p>
      </div>
      <PodiumSvg :position="[2, 1, 3][index]" />

    </div>
  </div>

  <!-- Dialogs -->
  <Transition name="dialog">
    <dialog v-if="sortDialogOpen" @click="sortDialogOpen = false" class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0">
      <div class="dialog-content" @click.stop>
        <DialogSort @closeDialog="sortDialogOpen = false" @updateSort="applySort" />
      </div>
    </dialog>
  </Transition>

  <Transition name="dialog">
    <dialog v-if="filterDialogOpen" @click="filterDialogOpen = false" class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0">
      <div class="dialog-content" @click.stop>
      <DialogPodiumFilter :currentFilters="filters" @updateFilters="applyFilters" @closeDialog="filterDialogOpen = false" />
      </div>
    </dialog>
  </Transition>

  <!-- Search -->
  <AppInput icon="search" placeholder="Search" />

  <!-- Leaderboard -->
  <div class="flex flex-col justify-around gap-7">
    <div v-for="(player, index) in leaderboardData" :key="player.userId">
      <AppLeaderboardPostion :position="index + 4" :name="player.firstname + ' ' + player.lastname" :amount="player.totalScore" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppIcon from '@/components/App/Icon.vue';
import DialogSort from '@/components/Dialog/Sort.vue';
import DialogPodiumFilter from '@/components/Dialog/PodiumFilter.vue';
import SettingsAvatar from '@/components/Settings/Avatar.vue';
import PodiumSvg from '@/components/Podium/PodiumSvg.vue';
import AppInput from '@/components/App/Input.vue';
import AppLeaderboardPostion from '@/components/App/LeaderboardPosition.vue';

const searchQuery = ref('');
const sortDialogOpen = ref(false);
const filterDialogOpen = ref(false);

const openSort = () => {
  sortDialogOpen.value = true;
};

const openFilter = () => {
  filterDialogOpen.value = true;
};

const selectedSort = ref("globaal");

const applySort = (sortType) => {
  selectedSort.value = sortType;
  fetchFilteredLeaderboard();
};

const filters = ref({
  locations: [],
  minAge: null,
  maxAge: null,
});

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters };  // Sla de nieuwe filterwaarden op
  fetchFilteredLeaderboard();
};


const podiumWinners = ref([]);
const leaderboardData = ref([]);

const fetchFilteredLeaderboard = async () => {
  const params = new URLSearchParams();

  if (filters.value.locations.length) {
    params.append('locationIds', filters.value.locations.join(','));
  }
  if (filters.value.minAge) {
    params.append('minAge', filters.value.minAge);
  }
  if (filters.value.maxAge) {
    params.append('maxAge', filters.value.maxAge);
  }
  if (selectedSort.value) {
    params.append('sortType', selectedSort.value);
  }

  console.log("API request:", params.toString());
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard/filter?${params.toString()}`);
    const data = await response.json();
    console.log("Leaderboard API response:", data);

    if (response.ok && Array.isArray(data) && data.length > 0) {
      const sortedPodium = [data[1], data[0], data[2]];  // 2e naar 1e, 1e naar 2e, 3e blijft
      podiumWinners.value = sortedPodium;
      leaderboardData.value = data.slice(3);  // Overige deelnemers
    } else {
      console.warn("No leaderboard data found:", data.message);
      podiumWinners.value = [];
      leaderboardData.value = [];
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
};


onMounted(() => {
  fetchFilteredLeaderboard();
});
</script>

<style scoped>
.dialog-content {
  @apply w-full h-max bg-black-15 flex flex-col gap-5 items-center px-2 pt-4 pb-6 fixed bottom-0 left-0 z-[55] rounded-3xl;
}

dialog::backdrop {
  background-color: rgba(13, 13, 13, 0.55);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 2px;
}

.scrollbar-track-black-10::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollbar-thumb-blue-54::-webkit-scrollbar-thumb {
  background: #1cb2b7;
  border-radius: 4px;
}
</style>
