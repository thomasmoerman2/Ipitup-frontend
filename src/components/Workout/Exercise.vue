<template>
  <button
    class="flex gap-3 items-center justify-between rounded-md p-3 h-max bg-black-10 box-border"
  >
  <div class="relative ">
      <img
        :src="img"
        alt="image"
        class="min-w-[86px] h-[74px] rounded-md aspect-square"
      />
      <div class="absolute bottom-0 left-0 p-0.5 bg-black-5 bg-opacity-80 rounded-tr rounded-bl-md">
      <AppIcon name="Star" color="text-blue-48" size="16"/>
    </div>
  </div>
    <div class="flex flex-col justify-between w-full h-max">
      <div class="flex flex-col text-left">
        <strong class="capitalize">{{ title }}</strong>
        <p class="uppercase text-[12px] font-light">{{ level }}</p>
      </div>
      <div class="flex items-center gap-1 text-[12px]">
        <AppIcon name="Timer" size="12" />
        <p class="uppercase">{{ time }} min</p>
      </div>
    </div>
    <div
      class="w-[22px] h-[22px] grid place-items-center bg-blue-54 rounded-full aspect-square text-white"
    >
    <AppIcon name="ChevronRight" size="16" />
    </div>
  </button>
</template>

<script setup>
import AppIcon from "@/components/App/Icon.vue";

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
});
</script>
