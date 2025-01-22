<template>
  <div>
    <div class="mb-10">
      <div class="flex gap-2 flex-wrap items-center mb-3">
        <AppDialog type="filter" title="Filter" icon="Filter" :currentFilters="currentFilters" @filterUpdate="handleFilterUpdate" />
        <!-- Selected filter chips -->
        <div v-for="exercise in currentFilters.exercises" :key="exercise" class="bg-blue-54 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 cursor-pointer hover:bg-blue-60 transition-colors" @click="removeFilter(exercise)">
          {{ exercise }}
          <AppIcon name="X" :size="14" />
        </div>
        <!-- Level chip if not 'all' -->
        <div v-if="currentFilters.level !== 'all'" class="bg-blue-54 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 cursor-pointer hover:bg-blue-60 transition-colors" @click="removeLevel()">
          Level {{ currentFilters.level }}
          <AppIcon name="X" :size="14" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <WorkoutExercise v-if="exercises.length > 0" v-for="exercise in exercises" :key="exercise.id" :img="exercise.image" :title="exercise.name" :level="exercise.level" :time="exercise.time" />
      <div v-else>
        <p class="text-blue-54 text-sm">Er zijn momenteel geen oefeningen beschikbaar.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppDialog from "@/components/App/Dialog.vue";
import AppIcon from "@/components/App/Icon.vue";
import { ref, onMounted } from 'vue';

// Store filter data
const currentFilters = ref({
  exercises: [],
  level: 'all',
  bundlesOnly: false,
  favoritesOnly: false
});

//fetch all exercises
const exercises = ref([]);

const fetch_exercises = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises`);
  const data = await response.json();
  exercises.value = data;
}

const fetch_exercises_by_categories = async (categories) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises/categories/${categories}`);
  const data = await response.json();
  exercises.value = data;
}

const removeFilter = (exercise) => {
  currentFilters.value = {
    ...currentFilters.value,
    exercises: currentFilters.value.exercises.filter(e => e !== exercise)
  };

  // Re-apply filters
  if (currentFilters.value.exercises.length > 0) {
    fetch_exercises_by_categories(currentFilters.value.exercises.join(','));
  } else {
    fetch_exercises();
  }
}

const removeLevel = () => {
  currentFilters.value = {
    ...currentFilters.value,
    level: 'all'
  };

  // Re-apply filters with updated level
  if (currentFilters.value.exercises.length > 0) {
    fetch_exercises_by_categories(currentFilters.value.exercises.join(','));
  } else {
    fetch_exercises();
  }
}

const handleFilterUpdate = (filterData) => {
  // Update the current filters
  currentFilters.value = filterData;

  // Apply filters
  if (filterData.exercises.length > 0) {
    fetch_exercises_by_categories(filterData.exercises.join(','));
  } else {
    fetch_exercises();
  }
}

// Initial fetch
fetch_exercises();
</script>
