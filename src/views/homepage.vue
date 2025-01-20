<template>
  <div class=" flex w-full h-max gap-1 items-center bg-blue-6 p-2 rounded-full" v-if="isLoggedIn">
    <div class="w-16 h-16 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square">
      <img class="w-6" src="/public/fireblue.png" alt="Fire" />
    </div>
    <div class="flex flex-col relative size-full">
      <p class="font-bold text-[.875rem]">Doe zo verder!</p>
      <p class="text-[.75rem]">Je bent al aan 18 non-stop's! nog 4 te gaan.</p>
    </div>
  </div>
  <div class=" flex w-full h-max gap-1 items-center bg-blue-6 p-2 rounded-full" v-else>
    <div class="w-16 h-16 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square">
      <img class="w-8" src="/public/user.png" alt="User" />
    </div>
    <div class="flex flex-col relative size-full">
      <p class="font-bold text-[.875rem]">Wordt een echte Ipitup!</p>
      <p class="text-[.75rem]">Neem deel aan onze Ipitup community.</p>
    </div>
  </div>

  <p class="text-orange-35 font-bold pb-4 pt-4" v-if="isLoggedIn">Welkom terug!</p>
  <h1 class="text-blue-60 text-3xl pb-8" v-if="isLoggedIn">
    Klaar voor de volgende <span class="font-bold"> training?</span>
  </h1>
  <h1 class="text-blue-60 text-3xl pb-8" v-else>
    Klaar voor jouw eerste<span class="font-bold"> training?</span>
  </h1>

  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <p class="text-xs text-blue-54" v-if="isLoggedIn">Meest gebruikte oefeningen</p>
      <p class="text-xs text-blue-54" v-else>Bekijk alle oefeningen</p>
    </div>
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />
    <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />
    <AppButton text="Ontdek meer" icon="false" version="1" @click="func_change_page" v-if="!isLoggedIn" />
  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppButton from "@/components/App/Button.vue";
import { ref } from 'vue';

const isLoggedIn = ref(false);

if (localStorage.getItem('loggedIn')) {
  isLoggedIn.value = true;
}

const func_change_page = () => {
  window.location.href = '/exercises';
}

const fetch_3_exercises = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises/3`);
  const data = await response.json();
  console.log(data);
}
</script>
