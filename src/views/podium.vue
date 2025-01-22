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

  <!-- Dialogs -->
  <Transition name="dialog">
    <dialog v-if="sortDialogOpen" @click="sortDialogOpen = false" class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0">
      <div class="dialog-content" @click.stop>
        <DialogSort @closeDialog="sortDialogOpen = false" />
      </div>
    </dialog>
  </Transition>

  <Transition name="dialog">
    <dialog v-if="filterDialogOpen" @click="filterDialogOpen = false" class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0">
      <div class="dialog-content" @click.stop>
        <DialogPodiumFilter @closeDialog="filterDialogOpen = false" />
      </div>
    </dialog>
  </Transition>

  <!-- Podium -->
  <div class="flex items-end justify-center">
    <div v-for="winner in podiumWinners" :key="winner.position" class="flex flex-col items-center">
      <SettingsAvatar class="mb-2.5 max-w-16 max-h-16" />
      <p class="text-xs">{{ winner.name }}</p>
      <div class="flex items-center gap-1 mb-4">
        <AppIcon name="Gem" size="10" color="text-blue-54" />
        <p class="text-xs font-bold text-blue-54">{{ winner.score }}</p>
      </div>
      <PodiumSvg :position="winner.position" />
    </div>
  </div>

  <!-- Search -->
  <AppInput icon="search" placeholder="Search" />

  <!-- Leaderboard -->
  <div class="flex flex-col justify-around gap-7">
    <div v-for="player in leaderboardPlayers" :key="player.rank">
      <AppLeaderboardPostion :position="player.rank" :name="player.name" :amount="player.score" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

const podiumWinners = [
  {
    position: 2,
    name: 'Simon Mignolet',
    score: 3425,
  },
  {
    position: 1,
    name: 'Simon Mignolet',
    score: 4250,
  },
  {
    position: 3,
    name: 'Simon Mignolet',
    score: 2090,
  },
];

const leaderboardPlayers = [
  { rank: 4, name: 'Jan Peeters', score: 3425 },
  { rank: 5, name: 'Sophie Dupont', score: 3425 },
  { rank: 6, name: 'Tom De Smet', score: 3425 },
  { rank: 7, name: 'Jefke', score: 3425, isActive: true },
  { rank: 8, name: 'Pieter Janssens', score: 3425 },
  { rank: 9, name: 'Anne Lefèvre', score: 3425 },
  { rank: 10, name: 'Bart Vermeulen', score: 3425 },
];
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
