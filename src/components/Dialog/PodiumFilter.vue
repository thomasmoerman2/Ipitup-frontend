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
        <button v-for="city in cities" :key="city" @click="toggleCity(city)" :class="['px-4 py-2 rounded-md text-sm transition-colors', selectedCities.includes(city) ? 'bg-blue-54 text-white' : 'bg-blue-18 text-blue-84']">
          {{ city }}
        </button>
      </div>
    </div>

    <AppButton text="Toon resultaten" @click="func_closeDialog" version="1" icon="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '@/components/App/Button.vue';
import AppIcon from '@/components/App/Icon.vue';
import { NSlider, NSpace, NConfigProvider } from 'naive-ui';

const emit = defineEmits(['closeDialog']);

// Filter states
const ageRange = ref([0, 100]);
const cities = ['Kortrijk', 'Gent', 'Brussel', 'Antwerpen', 'Leuven'];
const selectedCities = ref([]);

const themeOverrides = {
  common: {
    primaryColor: '#35babf',
  },
};

const toggleCity = (city) => {
  const index = selectedCities.value.indexOf(city);
  if (index === -1) {
    selectedCities.value.push(city);
  } else {
    selectedCities.value.splice(index, 1);
  }
};

const func_closeDialog = () => {
  emit('closeDialog');
};

const resetFilters = () => {
  ageRange.value = [0, 100];
  selectedCities.value = [];
};
</script>
