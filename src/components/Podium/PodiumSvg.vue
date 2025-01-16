<template>
  <svg v-if="props.position === 2" width="95" height="63" viewBox="0 0 116 77" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="11" width="115.521" height="66" fill="#35BABF" />
    <path d="M18.1838 0H115.521V11H0L18.1838 0Z" fill="#81D4D7" />
  </svg>

  <svg v-else-if="props.position === 1" width="95" height="85" viewBox="0 0 117 105" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.935791" y="11.1729" width="115.521" height="93.8025" fill="url(#paint0_linear_939_6887)" />
    <path d="M18.4569 0H91.4182L116.358 11.17H0.837158L18.4569 0Z" fill="#B3E5E7" />
    <defs>
      <linearGradient id="paint0_linear_939_6887" x1="58.6961" y1="11.1729" x2="58.6961" y2="104.975" gradientUnits="userSpaceOnUse">
        <stop stop-color="#68CCCF" />
        <stop offset="1" stop-color="#1AA4A8" />
      </linearGradient>
    </defs>
  </svg>

  <svg v-else-if="props.position === 3" width="95" height="51" viewBox="0 0 116 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.674316" y="12" width="115.326" height="50" fill="#35BABF" />
    <path d="M97.816 0H0.479233V12H116L97.816 0Z" fill="#81D4D7" />
  </svg>
</template>

<script setup>
const props = defineProps({
  position: {
    type: Number,
    required: true,
    validator: (value) => [1, 2, 3].includes(value),
  },
});
</script>
