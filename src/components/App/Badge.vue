<template>
  <div 
    :style="{ opacity: badgeOpacity }" 
    class="relative flex items-center justify-center mb-2 w-[72px] h-[103px]"
  >
    <!-- SVG Badge -->
    <svg
      width="72"
      height="103"
      viewBox="0 0 72 103"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 9.99999C0 4.47714 4.47715 0 10 0H62C67.5229 0 72 4.47715 72 10V68.0215C72 70.7511 70.8841 73.3622 68.9113 75.2487L42.9113 100.112C39.0454 103.809 32.9546 103.809 29.0887 100.112L3.08867 75.2487C1.11586 73.3622 0 70.7511 0 68.0215V9.99999Z"
        :fill="badgeColor"
      />
    </svg>

    <!-- Naam van de oefening (bovenaan) -->
    <span class="absolute top-1 text-white font-black text-sm text-center">
      {{ exercise }}
    </span>

    <!-- Amount in het midden -->
    <span class="absolute text-white text-[2.5rem] font-black">
      {{ formattedAmount }}
    </span>

    <!-- Onderste decoratie of vlam icoon -->
    <div v-if="exercise !== 'Non-Stop'" 
      class="absolute -bottom-2 rounded-full border-[3px] p-2 border-white"
      :style="{ backgroundColor: badgeColor }"
    ></div>
    
    <div v-else class="absolute -bottom-2">
      <AppIcon
        name="Flame"
        color="text-white"
        :size="34"
        :fill="'url(#flame-gradient)'"
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF0000" />
            <stop offset="100%" stop-color="#FFD900" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from '@/components/App/Icon.vue';

const props = defineProps({
  state: {
    type: [Boolean, String],  // Verander de type naar Boolean voor betere verwerking
    default: true,  // Standaard naar 'true' als badge is behaald
  },
  exercise: {
    type: String,
    required: true,
  },
  amount: {
    type: [Number, String],  // Sta zowel Number als String toe en converteer later
    default: 0,
  },
});

// Dynamische kleur op basis van de oefening
const badgeColor = computed(() => {
  if (!props.state) {
    return '#737373'; // Grijs als de state false is (badge niet behaald)
  }
  return {
    "Push-up": '#1F418B',  // Blauw
    "Squat": '#8B1F21',    // Rood
    "Pull-up": '#1F8B36',   // Groen
    "Sit-up": '#6C1F8B',    // Paars
    "Non-Stop": '#D2992F', // Goudkleur voor Non-Stop
  }[props.exercise] || '#737373'; // Standaard grijs als fallback
});

// Opacity aanpassen als de badge nog niet is behaald
const badgeOpacity = computed(() => (props.state === "false" ? 0.3 : 1));

// Zorg ervoor dat 'amount' altijd een getal is
const formattedAmount = computed(() => Number(props.amount));
</script>
