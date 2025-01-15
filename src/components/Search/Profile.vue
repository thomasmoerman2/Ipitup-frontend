<template>
  <button class="flex items-center justify-between h-max">
    <div class="flex items-center justify-between h-max">
      <div class="flex items-center">
        <img :src="img" alt="image" class="w-[57px] h-[57px] rounded aspect-circle"/>
        <p class="font-bold">{{ name }}</p>
      </div>
      <p class="text-xs text-black-40">{{ username }}</p>
    </div>
  </button>
</template>

<script setup>

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});
</script>
