<template>
  <!-- Filter Buttons -->
  <div class="flex gap-2 justify-center">
    <AppFilters icon="ChevronsUpDown" text="Sorteren op" class="w-1/2" />
    <AppFilters icon="Filter" text="Filter" class="w-1/2" />
  </div>

  <!-- Podium -->
  <div class="flex items-end justify-center">
    <div
      v-for="winner in podiumWinners"
      :key="winner.position"
      class="flex flex-col items-center"
    >
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
  <div class="flex flex-col justify-around gap-4">
    <div v-for="player in leaderboardPlayers" :key="player.rank">
      <AppLeaderboardPostion
        :position="player.rank"
        :name="player.name"
        :amount="player.score"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppIcon from "@/components/App/Icon.vue";
import AppFilters from "@/components/App/Filters.vue";
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import PodiumSvg from "@/components/Podium/PodiumSvg.vue";
import AppInput from "@/components/App/Input.vue";
import AppLeaderboardPostion from "@/components/App/LeaderboardPosition.vue";

const searchQuery = ref("");

const podiumWinners = [
  {
    position: 2,
    name: "Simon Mignolet",
    score: 3425,
  },
  {
    position: 1,
    name: "Simon Mignolet",
    score: 4250,
  },
  {
    position: 3,
    name: "Simon Mignolet",
    score: 2090,
  },
];

const leaderboardPlayers = [
  { rank: 4, name: "Jan Peeters", score: 3425 },
  { rank: 5, name: "Sophie Dupont", score: 3425 },
  { rank: 6, name: "Tom De Smet", score: 3425 },
  { rank: 7, name: "Jefke", score: 3425, isActive: true },
  { rank: 8, name: "Pieter Janssens", score: 3425 },
  { rank: 9, name: "Anne Lefèvre", score: 3425 },
  { rank: 10, name: "Bart Vermeulen", score: 3425 },
];
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
