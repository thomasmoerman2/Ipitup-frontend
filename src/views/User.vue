<template>

    <div class="flex flex-col  justify-between gap-10">
      <div class="flex flex-col items-center gap-5">
        <SettingsAvatar />
        <div class="flex flex-col items-center">
          <p class="font-bold mb-[0.3125rem]">Pietjepuk</p>
          <p class="text-xs">@pietjepuk1998</p>
        </div>
        <AppSmallButton icon="User" version="blue" text="Volgen" />
      </div>
      
      <p class="text-xs">Recente activiteiten</p>

    </div>
  
  
  </template>
  
  <script setup>
  import SettingsAvatar from "@/components/Settings/Avatar.vue";
  import AppSmallButton from "@/components/App/SmallButton.vue";
  </script>
  