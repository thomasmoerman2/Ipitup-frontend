<template>
  <div class="flex flex-col gap-6 w-full px-3">
    <!-- Header with back button and reset -->
    <div class="flex justify-between items-center">
      <h1 class="font-bold">Filter</h1>
      <span class="text-blue-54 cursor-pointer" @click="resetFilters">Reset</span>
    </div>

    <!-- Age Range -->
    <div class="flex flex-col gap-2">
      <p class="text-sm">Leeftijd range</p>
      <n-config-provider :theme-overrides="themeOverrides">
        <n-space vertical>
          <n-slider v-model:value="ageRange" range :step="1" />
        </n-space>
      </n-config-provider>
    </div>

    <!-- Location -->
    <div class="flex flex-col gap-2">
      <p class="text-sm">Locatie</p>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="city in cities" 
          :key="city.locationId" 
          @click="toggleCity(city)" 
          :class="[
            'px-4 py-2 rounded-md text-sm transition-colors',
            selectedCities.some(selected => selected.locationId === city.locationId) 
              ? 'bg-blue-54 text-white' 
              : 'bg-blue-18 text-blue-84'
            ]"
          >
            {{ city.locationName }}
        </button>

      </div>
    </div>

    <AppButton text="Toon resultaten" @click="applyFilters" version="1" icon="false" />
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import AppButton from '@/components/App/Button.vue';
import { NSlider, NSpace, NConfigProvider } from 'naive-ui';

const props = defineProps({
  currentFilters: {
    type: Object,
    default: () => ({
      minAge: null,
      maxAge: null,
      locations: []
    })
  }
});

const emit = defineEmits(['updateFilters', 'closeDialog']);

// Filter states
const cities = ref([]);
const ageRange = ref([props.currentFilters.minAge || 0, props.currentFilters.maxAge || 100]);
const selectedCities = ref([]);



const themeOverrides = {
  common: {
    primaryColor: '#35babf',
  },
};

// Functie om locaties op te halen uit de API
const fetchCities = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/location`);
    if (!response.ok) throw new Error('Failed to fetch locations');

    const data = await response.json();
    cities.value = data.map(city => ({locationId: city.locationId,locationName: city.locationName}));
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};


onMounted(async () => {
  await fetchCities();
  selectedCities.value = cities.value.filter(city => 
    props.currentFilters.locations.includes(city.locationId)
  );
});


const toggleCity = (city) => {
  const exists = selectedCities.value.some(selected => selected.locationId === city.locationId);
  if (!exists) {
    selectedCities.value.push(city);
  } else {
    selectedCities.value = selectedCities.value.filter(selected => selected.locationId !== city.locationId);
  }
};



const applyFilters = () => {
  console.log("Selected location IDs:", selectedCities.value.map(selected => selected.locationId));
  emit('updateFilters', {
    locations: selectedCities.value.map(selected => selected.locationId),
    minAge: ageRange.value[0],
    maxAge: ageRange.value[1],
  });
  emit('closeDialog');
};



const resetFilters = () => {
  ageRange.value = [0, 100];
  selectedCities.value = [];
};
</script>

