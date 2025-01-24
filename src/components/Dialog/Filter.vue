<template>
  <h1 class="font-bold flex-col gap-6 w-full pl-3">Filters</h1>

  <!-- Selected Filters Display -->
  <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 px-3 mb-4">
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

  <div class="flex flex-col gap-6 w-full pl-3 pr-3">
    <!-- Exercise Types -->
    <div class="flex flex-col gap-2">
      <p class="text-sm">Type oefeningen</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="exercise in exerciseTypes"
          :key="exercise"
          @click="toggleExercise(exercise)"
          :class="[
            'px-4 py-2 rounded-md text-sm transition-colors',
            selectedExercises.includes(exercise)
              ? 'bg-blue-54 text-white'
              : 'bg-blue-18 text-blue-84',
          ]"
        >
          {{ exercise }}
        </button>
      </div>
    </div>

    <!-- Level Selection -->
    <!-- <div class="flex flex-col gap-2">
      <p class="text-sm">Level</p>
      <AppOptions
        :options="levelOptions"
        v-model="selectedLevel"
        @change="handleLevelChange"
      />
    </div> -->

    <!-- Switches -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <span class="text-sm">Alleen favorieten</span>
        <AppSwitch
          v-model="favoritesOnly"
          id="favorites-switch"
          @change="handleSwitchChange"
        />
      </div>
    </div>

    <AppButton
      text="Toepassen"
      @click="applyFilters"
      version="1"
      icon="false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppButton from "@/components/App/Button.vue";
import AppOptions from "@/components/App/Options.vue";
import AppSwitch from "@/components/App/Switch.vue";
import AppIcon from "@/components/App/Icon.vue";

const props = defineProps({
  currentFilters: {
    type: Array,
    default: () => [],
  },
  dataset: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["closeDialog", "updateFilters"]);

// Exercise types
const exerciseTypes = ["Push", "Pull", "Core", "Balance", "Squat"];
const selectedExercises = ref([]);

// Level options
const levelOptions = [
  { text: "Alle", value: "all" },
  { text: "1", value: "1" },
  { text: "2", value: "2" },
  { text: "3", value: "3" },
  { text: "4", value: "4" },
  { text: "5", value: "5" },
];
const selectedLevel = ref("all");

// Switch states
const bundlesOnly = ref(false);
const favoritesOnly = ref(false);

// Initialize filters from props
onMounted(() => {
  props.currentFilters.forEach((filter) => {
    switch (filter.category) {
      case "exercise":
        selectedExercises.value.push(filter.name);
        break;
      case "level":
        selectedLevel.value = filter.name.split(" ")[1];
        break;
      case "switch":
        if (filter.id === "bundles") {
          bundlesOnly.value = true;
        } else if (filter.id === "favorites") {
          favoritesOnly.value = true;
        }
        break;
    }
  });
});

// Computed property for active filters
const activeFilters = computed(() => {
  const filters = [];

  // Add selected exercises
  selectedExercises.value.forEach((exercise) => {
    filters.push({
      id: `exercise-${exercise.toLowerCase()}`,
      name: exercise,
      category: "exercise",
    });
  });

  // Add level if not 'all'
  if (selectedLevel.value !== "all") {
    filters.push({
      id: `level-${selectedLevel.value}`,
      name: `Level ${selectedLevel.value}`,
      category: "level",
    });
  }

  // Add switches if enabled
  if (bundlesOnly.value) {
    filters.push({
      id: "bundles",
      name: "Alleen bundels",
      category: "switch",
    });
  }
  if (favoritesOnly.value) {
    filters.push({
      id: "favorites",
      name: "Alleen favorieten",
      category: "switch",
    });
  }

  return filters;
});

const removeFilter = (filter) => {
  switch (filter.category) {
    case "exercise":
      const exerciseIndex = selectedExercises.value.indexOf(filter.name);
      if (exerciseIndex !== -1) {
        selectedExercises.value.splice(exerciseIndex, 1);
      }
      break;
    case "level":
      selectedLevel.value = "all";
      break;
    case "switch":
      if (filter.id === "bundles") {
        bundlesOnly.value = false;
      } else if (filter.id === "favorites") {
        favoritesOnly.value = false;
      }
      break;
  }
};

const toggleExercise = (exercise) => {
  const index = selectedExercises.value.indexOf(exercise);
  if (index === -1) {
    selectedExercises.value.push(exercise);
  } else {
    selectedExercises.value.splice(index, 1);
  }
};

const handleLevelChange = (value) => {
  selectedLevel.value = value;
};

const handleSwitchChange = () => {
  // No additional handling needed as v-model handles the state
};

const applyFilters = () => {
  emit("updateFilters", activeFilters.value);
  emit("closeDialog");
};
</script>

<style scoped>
.selected {
  @apply bg-blue-54 text-white;
}
</style>
