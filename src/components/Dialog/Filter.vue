<template>
  <h1 class="font-bold flex-col gap-6 w-full pl-3">Filters</h1>

  <div class="flex flex-col gap-6 w-full pl-3 pr-3">
    <!-- Exercise Types -->
    <div class="flex flex-col gap-2">
      <p class="text-sm">Type oefeningen</p>
      <div class="flex flex-wrap gap-2">
        <button v-for="exercise in exerciseTypes" :key="exercise" @click="toggleExercise(exercise)" :class="['px-4 py-2 rounded-md text-sm transition-colors', selectedExercises.includes(exercise) ? 'bg-blue-54 text-white' : 'bg-blue-18 text-blue-84']">
          {{ exercise }}
        </button>
      </div>
    </div>

    <!-- Level Selection -->
    <div class="flex flex-col gap-2">
      <p class="text-sm">Type oefeningen</p>
      <AppOptions :options="levelOptions" v-model="selectedLevel" @change="handleLevelChange" />
    </div>

    <!-- Switches -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <span class="text-sm">Alleen bundels</span>
        <AppSwitch v-model="bundlesOnly" id="bundles-switch" />
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm">Alleen favorieten</span>
        <AppSwitch v-model="favoritesOnly" id="favorites-switch" />
      </div>
    </div>

    <AppButton text="Opslaan" @click="func_closeDialog" version="1" icon="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Filter } from 'lucide-vue-next';
import AppButton from '@/components/App/Button.vue';
import AppOptions from '@/components/App/Options.vue';
import AppSwitch from '@/components/App/Switch.vue';

const emit = defineEmits(['closeDialog']);

// Exercise types
const exerciseTypes = ['Pushups', 'Dips', 'Plank', 'Squat', 'Core', 'Pull', 'Balance', 'Challenge'];
const selectedExercises = ref([]);

// Level options
const levelOptions = [
  { text: 'Alle', value: 'all' },
  { text: '1', value: '1' },
  { text: '2', value: '2' },
  { text: '3', value: '3' },
  { text: '4', value: '4' },
  { text: '5', value: '5' },
];
const selectedLevel = ref('all');

// Switch states
const bundlesOnly = ref(false);
const favoritesOnly = ref(false);

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

const func_closeDialog = () => {
  emit('closeDialog');
};
</script>

<style scoped>
.selected {
  @apply bg-blue-54 text-white;
}
</style>
