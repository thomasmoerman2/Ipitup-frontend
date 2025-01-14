<template>
  <div class="container">
    <AppHeader title="Search" />
    <div class="my-10">
      <AppInput icon="search" placeholder="Search"/>
    </div>

    <div class="flex flex-col gap-2.5"></div>
    <AppNavigation />
  </div>
</template>
<script setup>
import AppHeader from "@/components/App/Header.vue";
import AppInput from "@/components/App/Input.vue";
import AppNavigation from "@/components/App/Navigation.vue";
</script>
