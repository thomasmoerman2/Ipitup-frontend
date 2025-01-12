<template>
  <div class="container">
    <AppHeader />
    <div class="flex items-center bg-blue-6 p-2 rounded-full">
      <div
        class="w-20 h-20 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square"
      >
        <img class="w-10" src="../../public/fireblue.png" alt="" />
      </div>
      <div class="flex flex-col p-4 relative size-full">
        <p class="font-bold">Doe zo verder!</p>
        <p>Je bent al aan 18 non-stop's! nog 4 te gaan.</p>
        <p
          class="text-blue-42 absolute right-9 top-1/2 transform -translate-y-1/2 text-xl font-bold"
        >
          &gt;
        </p>
      </div>
    </div>
    <p class="text-purple-42 font-bold pb-4 pt-4">Welkom terug!</p>
    <h1 class="text-blue-60 text-4xl pb-8">
      Klaar voor de volgende <span class="font-bold"> training?</span>
    </h1>
    <div class="card-container flex justify-between gap-4">
      <a
        href="#"
        class="flex flex-col items-center text-center p-4 bg-blue-6 rounded w-60"
      >
        <img src="" alt="Timer" class="w-10 h-10 mb-2" />
        <p><strong>Totale tijd</strong></p>
        <p>02:10</p>
        <p>uur</p>
      </a>

      <a
        href="#"
        class="flex flex-col items-center text-center p-4 bg-blue-6 rounded w-60"
      >
        <img src="" alt="Repeat" class="w-10 h-10 mb-2" />
        <p><strong>Herhalingen</strong></p>
        <p>456</p>
      </a>

      <a
        href="#"
        class="flex flex-col items-center text-center p-4 bg-blue-6 rounded w-60"
      >
        <img src="" alt="Dumbbell" class="w-10 h-10 mb-2" />
        <p><strong>Oefeningen</strong></p>
        <p>4 soorten oefeningen</p>
      </a>
    </div>

    <div class="rounded-md bg-black-15 p-4 mt-10 flex flex-col gap-4">
      <div class="pt-5 flex justify-between">
        <p>Meest gebruikte oefeningen</p>
        <p class="text-blue-60">Zie alles</p>
      </div>
      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />
      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />
    </div>
  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/WorkoutExercise.vue";
import AppHeader from "@/components/AppHeader.vue";
</script>
