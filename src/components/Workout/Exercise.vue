<template>
  <RouterLink :to="`/workout/e=${url}`" class="flex gap-3 items-center justify-between rounded-md p-3 h-max bg-black-10 box-border">
    <img :src="img" alt="image" class="w-[84px] h-[74px] rounded-md aspect-square" />
    <div class="flex flex-col justify-between w-full h-max">
      <div class="flex flex-col text-left">
        <strong class="capitalize">{{ title }}</strong>
        <p class="uppercase text-[12px] font-light">{{ level }}</p>
      </div>
      <div class="flex items-center gap-1 text-[12px]">
        <Timer size="12" />
        <p class="uppercase">{{ time }} min</p>
      </div>
    </div>
    <div class="w-[22px] h-[22px] grid place-items-center bg-blue-54 rounded-full aspect-square text-white">
      <ChevronRight size="16" />
    </div>
  </RouterLink>
</template>

<script setup>
import { Timer, ChevronRight } from "lucide-vue-next";
import { RouterLink } from 'vue-router';

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
</script>
