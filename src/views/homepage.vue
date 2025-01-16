<template>
  <div class=" flex w-full h-max gap-1 items-center bg-blue-6 p-2 rounded-full">
    <div class="w-16 h-16 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square">
      <img class="w-6" src="../../public/fireblue.png" alt="" />
    </div>
    <div class="flex flex-col relative size-full">
      <p class="font-bold text-[.875rem]">Doe zo verder!</p>
      <p class="text-[.75rem]">Je bent al aan 18 non-stop's! nog 4 te gaan.</p>
    </div>
  </div>
  <p class="text-orange-35 font-bold pb-4 pt-4">Welkom terug!</p>
  <h1 class="text-blue-60 text-3xl pb-8">
    Klaar voor de volgende <span class="font-bold"> training?</span>
  </h1>

  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <p class="text-xs text-blue-54">Meest gebruikte oefeningen</p>
    </div>
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
</script>
