<template>
  <div class="flex flex-col gap-4">
    <!-- Selected Filters Display -->
    <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 px-4">
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
        :img="getExerciseImage(exercise.exerciseType)"
        :title="exercise.exerciseName"
        :level="exercise.exerciseType"
        :time="exercise.exerciseTime"
        :isFavorite="isFavorite"
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
    // Check each filter category
    return activeFilters.value.every((filter) => {
      switch (filter.category) {
        case "exercise":
          return exercise.type === filter.name;
        case "level":
          return exercise.level === parseInt(filter.name.split(" ")[1]);
        case "switch":
          if (filter.id === "bundles") {
            return exercise.isBundle;
          } else if (filter.id === "favorites") {
            return exercise.isFavorite;
          }
          return true;
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

const getExerciseImage = (exerciseType) => {
  return `/workoutimages/${exerciseType.toLowerCase()}.png`;
};


// Initial fetch
fetch_exercises();
</script>
