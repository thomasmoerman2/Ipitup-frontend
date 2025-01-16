<template>
  <div class="flex flex-col gap-5 container overflow-x-hidden">
    <AppHeader v-if="!hideNavigation" class="pt-16 z-[65]" />
    <RouterView />
    <div v-if="!hideNavigation" class="pb-20 z-[65]"></div>
    <AppNavigation v-if="!hideNavigation" class="z-[65]" />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import AppHeader from './components/App/Header.vue';
import AppNavigation from './components/App/Navigation.vue';

const route = useRoute();
const hideNavigation = computed(() => route.meta.hideNavigation);
</script>
