<template>
  <div class="flex flex-col gap-5 container">
    <AppHeader class="pt-16" />
    <RouterView />
    <div class="pb-20"></div>
    <AppNavigation />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/App/Header.vue';
import AppNavigation from './components/App/Navigation.vue';
</script>
