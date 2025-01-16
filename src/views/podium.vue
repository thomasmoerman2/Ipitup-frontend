<template>
  <!-- Filter Buttons -->
  <div class="flex gap-2.5">
    <button class="flex-1 flex items-center justify-center gap-2.5 bg-blue-6 rounded-lg py-2 text-xs">
      <ChevronDown class="w-3.5 h-3.5" />
      Sorteren op
    </button>
    <button class="flex-1 flex items-center justify-center gap-2.5 bg-blue-6 rounded-lg py-2 text-xs">
      <Filter class="w-3.5 h-3.5" />
      Filter
    </button>
  </div>

  <!-- Podium -->
  <div class="flex items-end justify-center my-8">
    <div v-for="winner in podiumWinners" :key="winner.position" class="flex flex-col items-center">
      <SettingsAvatar class="mb-2.5" />
      <p class="text-xs mb-1">{{ winner.name }}</p>
      <div class="flex items-center gap-1 mb-4">
        <Gem class="w-2.5 h-2.5 text-blue-54" />
        <p class="text-xs font-bold text-blue-54">{{ winner.score }}</p>
      </div>
      <PodiumSvg :position="winner.position" />
    </div>
  </div>

  <!-- Search -->
  <div class="mb-8">
    <div class="flex items-center gap-3 bg-black-10 border border-black-40 rounded-md px-4 py-3">
      <Search class="w-4 h-4 text-black-40" />
      <input type="text" placeholder="Search" class="w-full bg-transparent border-none outline-none text-xs" v-model="searchQuery" />
    </div>
    <p v-if="showNoResults" class="text-center text-black-60 py-5 text-sm">Geen resultaten gevonden</p>
  </div>

  <!-- Leaderboard -->
  <div class="h-[calc(100vh-450px)] overflow-y-auto pr-2.5 scrollbar-thin scrollbar-track-black-10 scrollbar-thumb-blue-54">
    <div v-for="player in leaderboardPlayers" :key="player.rank" :class="['flex items-center justify-between mb-8', { '': player.isActive }]">
      <div class="flex items-center gap-3">
        <div :class="['flex items-center justify-center w-6 h-6 text-sm', player.isActive ? 'bg-blue-54 text-white rounded-full' : 'bg-blue-18 text-blue-54 rounded-full border-blue-54']">
          {{ player.rank }} 
        </div>
        <p class="text-xs">{{ player.name }}</p>
      </div>
      <div class="flex items-center gap-1">
        <Gem class="w-3 h-3 text-blue-54" />
        <p class="text-xs font-bold text-blue-54">{{ player.score }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown, Filter, Search, Gem } from 'lucide-vue-next';
import PodiumSvg from '@/components/Podium/PodiumSvg.vue';
import SettingsAvatar from '@/components/Settings/Avatar.vue';

const searchQuery = ref('');

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
  { rank: 11, name: 'Claire Dubois', score: 3425 },
  { rank: 12, name: 'Koenraad De Bock', score: 3425 },
  { rank: 13, name: 'Julie Lambert', score: 3425 },
  { rank: 14, name: 'Els Van den Broeck', score: 3425 },
  { rank: 15, name: 'Lucien Martin', score: 3425 },
  { rank: 16, name: 'Lotte Maes', score: 3425 },
  { rank: 17, name: 'Jean-Luc Delvaux', score: 3425 },
  { rank: 18, name: 'Jeroen Claes', score: 3425 },
  { rank: 19, name: 'Manon Simon', score: 3425 },
  { rank: 20, name: 'Bram De Ridder', score: 3425 },
];

const showNoResults = ref(false);
</script>

<style scoped>
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
