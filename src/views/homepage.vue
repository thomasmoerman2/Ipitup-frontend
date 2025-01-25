<template>
  <div class=" flex w-full h-max gap-1 items-center bg-blue-6 p-2 rounded-full" v-if="isLoggedIn">
    <div class="w-16 h-16 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square">
      <img class="w-6" src="/fireblue.png" alt="Fire" />
    </div>
    <div class="flex flex-col relative size-full">
      <p class="font-bold text-[.875rem]">Doe zo verder!</p>
      <p class="text-[.75rem]">Je bent al aan 18 non-stop's! nog 4 te gaan.</p>
    </div>
  </div>
  <div class=" flex w-full h-max gap-1 items-center bg-blue-6 p-2 rounded-full" v-else>
    <div class="w-16 h-16 bg-gradient-to-t from-blue-18 to-blue-12 rounded-full flex items-center justify-center aspect-square">
      <img class="w-8" src="/user.png" alt="User" />
    </div>
    <div class="flex flex-col relative size-full">
      <p class="font-bold text-[.875rem]">Wordt een echte Ipitup!</p>
      <p class="text-[.75rem]">Neem deel aan onze Ipitup community.</p>
    </div>
  </div>

  <div class="flex uppercase text-blue-60 text-6xl justify-center items-center py-5 flex-col anim-letters" :class="{ animate: shouldAnimate }" v-if="!isLoggedIn">
    <p class="font-bold">make</p>
    <p class="text-black-100 text-2xl text-center">your</p>
    <p>move</p>
  </div>

  <p class="text-orange-35 font-bold pb-4" v-if="isLoggedIn">Welkom terug!</p>
  <h1 class="text-blue-60 text-3xl" v-if="isLoggedIn">
    Klaar voor de volgende <span class="font-bold"> training?</span>
  </h1>
  <h1 class="text-blue-60 text-3xl" v-else>
    Klaar voor jouw eerste<span class="font-bold"> training?</span>
  </h1>

  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <p class="text-xs text-blue-54" v-if="isLoggedIn && userActivities.length > 0">
        Jouw recente oefeningen
      </p>
      <p class="text-xs text-blue-54" v-else>
        Ontdek enkele van onze oefeningen
      </p>
    </div>
    <template v-if="userActivities.length > 0">
      <WorkoutExercise v-for="activity in userActivities" :key="activity.id || activity.exerciseId" :type="String(activity.type)" :id="String(activity.id || activity.exerciseId)" :img="getExerciseImage(activity.type)" :title="activity.name" :level="String(activity.type)" :time="String(activity.time)" :isFavorite="isFavorite" />
    </template>

    <template v-else-if="exercises.length > 0">
      <WorkoutExercise v-for="exercise in exercises" :key="exercise.id" :img="getExerciseImage(exercise.type)" :title="exercise.name" :level="exercise.level" :time="exercise.time" />
    </template>

    <div v-else>
      <p class="text-blue-54 text-sm">Er zijn momenteel geen oefeningen beschikbaar.</p>
    </div>

  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppButton from "@/components/App/Button.vue";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const router = useRouter();
const isLoggedIn = ref(false);
const exercises = ref([]);
const shouldAnimate = ref(false);
const userActivities = ref([]);
const isFavorite = ref([]);

// Wanneer de component wordt gemount, check of de gebruiker is ingelogd
onMounted(async () => {
  if (Cookies.get('authToken')) {
    isLoggedIn.value = true;
    await fetchUserActivities();
  } else {
    console.log("Gebruiker is niet ingelogd, ophalen van random oefeningen.");
    await fetch_3_exercises();
  }
});



// 3 activiteiten tonen als je geen recente activiteiten hebt
const fetch_3_exercises = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises/random?count=3`);
    const data = await response.json();
    console.log("Fetched exercises:", data);

    if (Array.isArray(data) && data.length > 0) {
      exercises.value = data.map(ex => ({
        id: ex.exerciseId || `unknown-${Math.random().toString(36).substr(2, 9)}`, // Gebruik juiste veldnaam
        type: ex.exerciseType || "unknown",
        name: ex.exerciseName || "Onbekende oefening",
        level: ex.exerciseType || "Onbekend",
        time: ex.exerciseTime || "0",
      }));
    } else {
      console.warn("Geen oefeningen ontvangen bij het ophalen van random oefeningen.");
    }
  } catch (error) {
    console.error("Fout bij ophalen van oefeningen:", error);
  }
};



// Functie om de laatste 3 activiteiten van de gebruiker op te halen
const fetchUserActivities = async () => {
  try {
    const userId = Cookies.get('userId'); // Haal userId uit cookies
    if (!userId) {
      console.error("Geen userId gevonden in cookies, ophalen van willekeurige oefeningen.");
      await fetch_3_exercises();
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/info/${userId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.exercises && Array.isArray(data.exercises) && data.exercises.length > 0) {
      userActivities.value = data.exercises.slice(0, 3);
    }

    // Controleer of we minder dan 3 activiteiten hebben en vul aan met random oefeningen
    if (userActivities.value.length < 3) {
      console.info("Minder dan 3 activiteiten, ophalen van extra willekeurige oefeningen.");
      await fetch_3_exercises();
    }
  } catch (error) {
    console.error("Fout bij ophalen van activiteiten:", error);
    await fetch_3_exercises();
  }
};



if (Cookies.get('authToken')) {
  isLoggedIn.value = true;
} else {
  fetch_3_exercises();
}


// Functie om naar de oefeningenpagina te navigeren
const func_change_page = () => {
  window.location.href = '/exercises';
};


const getExerciseImage = (exerciseType) => {
  return `/workoutimages/${exerciseType.toLowerCase()}`;
};



</script>

<style scoped>
.anim-letters.animate p:nth-child(1) {
  animation: anim-letters-down 1s ease-in-out;
  animation-delay: 0.2s;
  transform: translateY(-100%);
  opacity: 0;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  will-change: transform, opacity;
}

.anim-letters.animate p:nth-child(2) {
  animation: anim-letters-right 1s ease-in-out;
  animation-delay: 0.4s;
  transform: translateX(-100%);
  opacity: 0;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  will-change: transform, opacity;
}

.anim-letters.animate p:nth-child(3) {
  animation: anim-letters-up 1s ease-in-out;
  animation-delay: 0.6s;
  transform: translateY(100%);
  opacity: 0;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  will-change: transform, opacity;
}

.anim-letters:not(.animate) p {
  opacity: 1;
  transform: none;
}

@keyframes anim-letters-down {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes anim-letters-up {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes anim-letters-right {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
