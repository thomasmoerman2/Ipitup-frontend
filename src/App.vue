<template>
  <div v-if="isLoading" class="flex flex-col gap-5 overflow-x-hidden">
    <Preload @loading-complete="handleLoadingComplete" />
  </div>
  <div v-else class="flex flex-col gap-5 container mx-auto overflow-x-hidden" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Limited mode indicator -->
    <div v-if="isLimitedMode" class="fixed top-0 left-0 right-0 bg-blue-54 bg-opacity-90 text-white text-xs py-1.5 text-center z-[70] border-b border-blue-600">
      <div class="flex items-center justify-center gap-2">
        <span class="w-2 h-2 rounded-full animate-pulse" :class="{ 'bg-red-400': hasErrors, 'bg-yellow-400': isOfflineMode && !hasErrors, 'bg-blue-200': isLimitedMode && !isOfflineMode && !hasErrors }"></span>
        <span class="flex items-center gap-1">
          {{ limitedModeMessage }}
        </span>
        <span class="text-[10px] opacity-75 border-l border-white/20 pl-2">{{ timeSinceActivation }}</span>
      </div>
    </div>

    <!-- Pull to refresh indicator -->
    <div v-if="pullDistance > 0" class="fixed top-0 left-0 right-0 flex justify-center py-3 bg-blue-6 text-blue-54 z-50" :style="{ transform: `translateY(${Math.max(limitedModeOffset, pullDistance)}px)` }">
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
import { ref, computed, onMounted, watch } from 'vue';
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

// Add timer for mode duration
const currentTime = ref(new Date());
setInterval(() => {
  currentTime.value = new Date();
}, 60000); // Update every minute

const isOfflineMode = computed(() => localStorage.getItem('goOffline') === 'true');
const isSkipMode = computed(() => localStorage.getItem('skipLoading') === 'true');

const isLimitedMode = computed(() => isOfflineMode.value || isSkipMode.value);

const getModeStartTime = computed(() => {
  if (isOfflineMode.value) {
    return localStorage.getItem('offlineModeStartTime');
  }
  if (isSkipMode.value) {
    return localStorage.getItem('limitedModeStartTime');
  }
  return null;
});

const timeSinceActivation = computed(() => {
  const startTime = getModeStartTime.value;
  if (!startTime) return '';

  const minutes = Math.floor((currentTime.value - new Date(startTime)) / 60000);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}u`;
});

// Error tracking
const errorCount = ref(0);
const hasErrors = computed(() => errorCount.value > 0);

// Console error interceptor
const originalConsoleError = console.error;
console.error = (...args) => {
  errorCount.value++;
  originalConsoleError.apply(console, args);
};

// Reset error count on route change
watch(() => route.path, () => {
  errorCount.value = 0;
});

const limitedModeMessage = computed(() => {
  if (isOfflineMode.value) return hasErrors.value ? 'Offline modus • Beperkte verbinding' : 'Offline modus • Beperkte functionaliteit';
  if (isSkipMode.value) return hasErrors.value ? 'Beperkte modus • Verbindingsproblemen' : 'Beperkte modus • Sommige functies niet beschikbaar';
  return '';
});

const limitedModeOffset = computed(() => isLimitedMode.value ? 24 : 0);

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
