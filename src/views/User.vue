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

    <div class="flex flex-col gap-5">
      <p class="text-xs">Recente activiteiten</p>
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
      <WorkoutRecent img="https://picsum.photos/100" title="pushups" level="1" time="10" amount="251" />
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex justify-between mx-8">
        <p>Badges</p>
        <p class="underline underline-offset-8">Leaderboard</p>
      </div>

      <div class="flex flex-col full-width-section bg-black-8">
        <div class="flex flex-col items-center my-5 gap-2.5">
          <div class="flex items-center gap-1.5">
            <AppIcon name="Gem" color="text-blue-48" size="24" />
            <p class="text-3xl font-bold">9624</p>
          </div>
          <p>3de Plaats</p>
          <AppSmallButton version="blue" text="Bekijk op leaderboard" />
        </div>
        <div class="flex flex-col gap-[0.3125rem]">
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" position="1" name="Pietjepuk" amount="9739" />
          <AppLeaderboardPosition class="bg-black-20 rounded-md mx-8 px-4 py-3" me="true" position="2" name="Thibo" amount="9739" />
        </div>

        <p class="text-center text-xs pt-1 pb-5">
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
import WorkoutRecent from "@/components/Workout/Recent.vue";
import AppLeaderboardPosition from "@/components/App/LeaderboardPosition.vue";
</script>

<style scoped>
.full-width-section {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
