<template>
  <RouterLink
    :to="`/workout/active/${id}`"
    :data-type="type"
    class="flex gap-3 items-center justify-between rounded-md p-3 h-max bg-black-10 box-border"
  >
    <div class="relative">
      <img
        :src="`./public/${img}.png`"
        alt="image"
        class="min-w-[86px] h-[74px] rounded-md aspect-square"
      />
    </div>
    <div class="flex flex-col justify-between w-full h-max">
      <div class="flex flex-col text-left">
        <strong class="capitalize">{{ title }}</strong>
        <p class="uppercase text-[12px] font-light">{{ level }}</p>
      </div>
      <div class="flex items-center gap-1 text-[12px]">
        <AppIcon name="Timer" :size="12" />
        <p class="uppercase">{{ time }} sec</p>
      </div>
    </div>
    <div
      class="w-[22px] h-[22px] grid place-items-center bg-blue-54 rounded-full aspect-square text-white"
    >
      <AppIcon name="ChevronRight" :size="16" />
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";
import AppIcon from "@/components/App/Icon.vue";


defineProps({
  id: {
    type: String,
    required: true,
  },
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
  type: {
    type: String,
    required: true,
  },
});
</script>
