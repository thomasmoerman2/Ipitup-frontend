<template>
    <div class="relative flex items-center justify-center mb-2 w-[72px] h-[103px]">
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
      <span class="absolute top-1 text-white font-black">
        {{ exercise }}
      </span>
  
      <!-- Amount in het midden -->
      <span class="absolute text-white text-[2.5rem] font-black">
        {{ amount }}
      </span>
      <div
      class="absolute -bottom-2  rounded-full border-[3px] p-2 border-white"
      :style="{ backgroundColor: badgeColor }"
    ></div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    exercise: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
  });
  
  // Dynamische kleur op basis van de oefening
  const badgeColor = computed(() => {
    return {
      Pushup: '#1F418B',   // Blauw
      Squat: '#8B1F21',    // Rood
      Pullup: '#1F8B36',   // Groen
      Situp: '#6C1F8B',    // Paars
    }[props.exercise] || '#737373'; // Standaard grijs als fallback
  });
  </script>
  