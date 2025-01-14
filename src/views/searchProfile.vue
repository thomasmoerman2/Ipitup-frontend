<template>
  <div class="container">
    <AppHeader title="Search" />
    <div class="my-10">
      <AppInput icon="search" placeholder="Search" />
    </div>

    <div class="flex flex-col gap-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img class="mr-[5px]" alt="picture" />
          <p class="font-bold">Person</p>
        </div>
        <p class="text-xs text-black-40">@gebruikersnaam</p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img class="mr-[5px]" alt="picture" />
          <p class="font-bold">Person</p>
        </div>
        <p class="text-xs text-black-40">@gebruikersnaam</p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img class="mr-[5px]" alt="picture" />
          <p class="font-bold">Person</p>
        </div>
        <p class="text-xs text-black-40">@gebruikersnaam</p>
      </div>
    </div>

    <AppNavigation />
  </div>
</template>
<script setup>
import AppHeader from "@/components/App/Header.vue";
import AppInput from "@/components/App/Input.vue";
import AppNavigation from "@/components/App/Navigation.vue";
</script>
