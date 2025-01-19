<template>
  <div v-if="isLoading" class="flex flex-col gap-5 overflow-x-hidden">
    <Preload @loading-complete="handleLoadingComplete" />
  </div>
  <div v-else class="flex flex-col gap-5 container overflow-x-hidden">
    <AppHeader v-if="!hideNavigation" class="pt-16 z-[65]" />
    <RouterView />
    <div v-if="!hideNavigation" class="pb-20 z-[65]"></div>
    <AppNavigation v-if="!hideNavigation" class="z-[65]" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/App/Header.vue';
import AppNavigation from './components/App/Navigation.vue';
import Preload from './views/Preload.vue';

const isLoading = ref(false);

const route = useRoute();
const hideNavigation = computed(() => route.meta.hideNavigation);

// Add this to handle loading completion
const handleLoadingComplete = () => {
  try {
    isLoading.value = false;
    return null;
  } catch (error) {
    console.error('Error in loading completion:', error);
    return null;
  }
};

</script>
