
<template>

      <div class="flex flex-col  justify-between gap-10">
        <div class="flex flex-col items-center gap-5">
          <SettingsAvatar />
          <div class="flex flex-col items-center">
            <p class="font-bold mb-[0.3125rem]">Pietjepuk</p>
            <p class="text-xs">@pietjepuk1998</p>
          </div>
          <AppSmallButton version="blue" text="Profiel bewerken" />
        </div>
  
        <div class="flex justify-around w-full">
          <ProfileInfo icon="Award" text="Badges" amount="7" />
          <ProfileInfo icon="RefreshCw" text="Oefeningen" amount="29" />
          <ProfileInfo icon="Gem" text="Punten" amount="544" />
        </div>
  
        <div>
          <p class="font-bold">Moving time</p>
          <div class="w-fit whitespace-nowrap">
            <AppOptions :options="[{ text: 'Deze week', value: 'Deze week' }, { text: 'Deze maand', value: 'Deze maand' }]" v-model="selectedOption" @change="func_Emit2" />
          </div>
        </div>


        <div>
          <p class="font-bold">Badges</p>
        </div>
      </div>
  
  </template>
  
  <script setup>
  import SettingsAvatar from "@/components/Settings/Avatar.vue";
  import AppSmallButton from "@/components/App/SmallButton.vue";
  import ProfileInfo from "@/components/Profile/Info.vue";
  import AppOptions from "@/components/App/Options.vue";
  </script>