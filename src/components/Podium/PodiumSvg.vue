<template>
  <svg v-if="props.position === 2" width="95" height="63" viewBox="0 0 116 77" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="11" width="115.621" height="66" fill="#35BABF" />
    <path d="M18.838 0H115.621V11H0L18.1838 0Z" fill="#81D4D7" />
    <text x="58" y="50" fill="#D9D9D9" font-size="32" font-weight="medium" text-anchor="middle" dominant-baseline="middle">2</text>
  </svg>

  <svg v-else-if="props.position === 1" width="95" height="85" viewBox="0 0 117 105" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.7" y="11.1729" width="115.521" height="93.8025" fill="url(#paint0_linear_939_6887)" />
    <path d="M18.4569 0H91.4182L116.358 11.17H0.837158L18.4569 0Z" fill="#B3E5E7" />
    <text x="58" y="60" fill="#D9D9D9" font-size="32" font-weight="medium" text-anchor="middle" dominant-baseline="middle">1</text>
    <defs>
      <linearGradient id="paint0_linear_939_6887" x1="58.6961" y1="11.1729" x2="58.6961" y2="104.975" gradientUnits="userSpaceOnUse">
        <stop stop-color="#68CCCF" />
        <stop offset="1" stop-color="#1AA4A8" />
      </linearGradient>
    </defs>
  </svg>

  <svg v-else-if="props.position === 3" class="position-3" width="94.5" height="51" viewBox="0.4316 0 115.326 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="115.326" height="50" fill="#35BABF" />
    <path d="M97.816 0H4.279233V12H116L97.816 0Z" fill="#81D4D7" />
    <text x="60" y="40" fill="#D9D9D9" font-size="32" font-weight="medium" text-anchor="middle" dominant-baseline="middle">3</text>
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

<style scoped>
svg {
  margin: -0.6px; /* Verwijdert marges */
}

.position-3 {
  margin-left: -2.8px; /* Moves position 3 closer to position 1 */
}
</style>
