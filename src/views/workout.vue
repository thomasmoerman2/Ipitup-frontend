<template>
  <div class="flex flex-col gap-4">
    <!-- Selected Filters Display -->
    <div
      v-if="activeFilters.length > 0"
      data-type="filter"
      class="flex flex-wrap gap-2 px-4"
    >
      <div
        v-for="filter in activeFilters"
        :key="filter.id"
        class="flex items-center gap-2 bg-blue-54 bg-opacity-10 text-blue-54 px-3 py-1 rounded-full"
      >
        <span class="text-sm">{{ filter.name }}</span>
        <button @click="removeFilter(filter)" class="hover:text-blue-700">
          <AppIcon name="Close" :size="16" />
        </button>
      </div>
    </div>

    <!-- Filter Dialog Button -->
    <AppDialog
      title="Filter"
      type="filter"
      @updateFilters="handleFilterUpdate"
      :currentFilters="activeFilters"
      :dataset="exercises"
    />

    <!-- Workout Content -->
    <div class="flex flex-col gap-3">
      <WorkoutExercise
        v-if="exercises.length > 0"
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :img="exercise.exerciseType"
        :title="exercise.exerciseName"
        :level="exercise.exerciseType"
        :time="exercise.exerciseTime"
        :isFavorite="isFavorite"
        :type="exercise.exerciseType"
        @setFavorite="setFavorite"
        :id="exercise.exerciseId"
      />
      <div v-else>
        <p class="text-blue-54 text-sm">
          Er zijn momenteel geen oefeningen beschikbaar.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppDialog from "@/components/App/Dialog.vue";
import AppIcon from "@/components/App/Icon.vue";
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import Cookies from "js-cookie";

const exercises = ref([]);
const activeFilters = ref([]);
const isFavorite = ref([]);

isFavorite.value = Cookies.get("isFavorite");

const fetch_exercises = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/exercises`
    );
    const data = await response.json();
    console.log(data);
    exercises.value = data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};

const removeFilter = (filter) => {
  const index = activeFilters.value.findIndex((f) => f.id === filter.id);
  if (index !== -1) {
    activeFilters.value.splice(index, 1);
  }
};

const handleFilterUpdate = (filters) => {
  activeFilters.value = filters;
};

const filteredExercises = computed(() => {
  if (activeFilters.value.length === 0) {
    return exercises.value;
  }

  return exercises.value.filter((exercise) => {
    // Check if exercise matches any filter category
    return activeFilters.value.some((filter) => {
      console.log(exercise.exerciseType, filter);
      switch (filter.category) {
        case "exercise":
          return exercise.exerciseType === filter.name;
        default:
          return true;
      }
    });
  });
});

function setFavorite(exerciseId) {
  isFavorite.value.push(exerciseId);
  Cookies.set("isFavorite", isFavorite.value);
}

// Initial fetch
fetch_exercises();
</script>

<style scoped>
/* Add any additional styles you need */
</style>
