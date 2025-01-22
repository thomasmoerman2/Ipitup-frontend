<template>
  <div v-if="isLoading" class="flex flex-col gap-5 overflow-x-hidden">
    <Preload @loading-complete="handleLoadingComplete" />
  </div>
  <div v-else class="flex flex-col gap-5 container mx-auto overflow-x-hidden" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Pull to refresh indicator -->
    <div v-if="pullDistance > 0" class="fixed top-0 left-0 right-0 flex justify-center py-3 bg-blue-6 text-blue-54 z-50" :style="{ transform: `translateY(${pullDistance}px)` }">
      <div class="flex items-center gap-2">
        <span v-if="isReloading" class="animate-spin">⟳</span>
        <span v-else>↓</span>
        {{ isReloading ? 'Reloading...' : (pullDistance >= 60 ? 'Release to refresh' : 'Pull to refresh') }}
      </div>
    </div>

    <AppHeader v-if="!hideNavigation" class="pt-16 z-[65]" />
    <RouterView :key="refreshKey" />
    <div v-if="!hideNavigation" class="pb-20"></div>
    <AppNavigation v-if="!hideNavigation" class="z-[65]" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/App/Header.vue';
import AppNavigation from './components/App/Navigation.vue';
import Preload from './views/Preload.vue';

const isLoading = ref(true);
const refreshKey = ref(0);
const touchStartY = ref(0);
const pullDistance = ref(0);
const isPulling = ref(false);
const isReloading = ref(false);

const route = useRoute();
const hideNavigation = computed(() => route.meta.hideNavigation);

const handleTouchStart = (e) => {
  if (window.scrollY === 0) {
    touchStartY.value = e.touches[0].clientY;
    isPulling.value = true;
    pullDistance.value = 0;
  }
};

const handleTouchMove = (e) => {
  if (!isPulling.value) return;

  const touch = e.touches[0];
  const distance = touch.clientY - touchStartY.value;

  if (distance > 0) {
    e.preventDefault();
    pullDistance.value = Math.min(distance / 2, 100);
  } else {
    pullDistance.value = 0;
  }
};

const handleTouchEnd = async () => {
  if (!isPulling.value) return;

  const shouldRefresh = pullDistance.value >= 60;
  pullDistance.value = 0;
  isPulling.value = false;

  if (shouldRefresh && !isReloading.value) {
    isReloading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    refreshKey.value++;
    isReloading.value = false;
  }
};

const handleLoadingComplete = () => {
  isLoading.value = false;
};
</script>

<style>
body {
  overscroll-behavior-y: contain;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
