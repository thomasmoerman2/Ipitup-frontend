<template>
  <div class="flex flex-col gap-10 container">
    <AppHeader class="pt-16" />
    <RouterView class="pb-32" />
    <AppNavigation />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/App/Header.vue';
import AppNavigation from './components/App/Navigation.vue';
</script>
