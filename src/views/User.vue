<template>
  <div class="flex flex-col justify-between gap-10">
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">Pietjepuk</p>
        <p class="text-xs">@pietjepuk1998</p>
        <div class="flex pt-2.5">
          <p class="text-2xs italic text-black-50">Gebruiker sinds&nbsp;</p>
          <p class="text-2xs italic text-blue-36">mei 2024</p>
        </div>
      </div>
      <AppSmallButton icon="User" version="blue" text="Volgen" />
    </div>

    <p class="text-xs">Recente activiteiten</p>

    <div class="flex flex-col gap-3">
      <div class="flex justify-around">
        <p>Badges</p>
        <p>Leaderboard</p>
      </div>
      <div class="flex flex-col justify-center items-center bg-black-10">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" size="24" />
            <p class="text-3xl font-bold">9624</p>
          </div>
          <p>3de Plaats</p>
          <AppSmallButton version="blue" text="Bekijk op leaderboard" />
        </div>

        <div
          class="inline-flex justify-around bg-black-20 w-full items-center px-4 py-3 rounded-md"
        >
          <div class="flex items-center gap-1.5">
            <p class="bg-blue-6 text-blue-48 px-2 rounded-full">3</p>
            <p class="text-xs">Thibo</p>
          </div>
          <div class="flex items-center gap-1">
            <AppIcon name="Gem" color="text-blue-48" size="12" />
            <p class="text-blue-48">9624</p>
          </div>
        </div>
        <p class="text-xs pt-1 pb-5">
          Je staat 115 punten achter Thibo! Ga ervoor!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppIcon from "@/components/App/Icon.vue";
</script>
