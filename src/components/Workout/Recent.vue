<template>
  <button
    class="flex gap-3 items-center justify-between rounded-md p-3 h-max bg-black-8 box-border"
  >
    <div class="relative">
      <img
        :src="img"
        alt="image"
        class="min-w-[60px] h-[52px] rounded-md aspect-square"
      />
    </div>
    <div class="flex flex-col justify-between w-full h-max">
      <div class="flex flex-col text-left">
        <strong class="capitalize">{{ title }}</strong>
        <p class="uppercase text-[12px] font-light">{{ level }}</p>
      </div>
      <div class="flex items-center gap-1 text-[12px]">
        <AppIcon name="Timer" :size="12" />
        <p class="uppercase">{{ time }} min</p>
      </div>
    </div>
    <div class="grid place-items-center">
      <p class="text-[1.25rem] font-medium">{{ amount }}</p>
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

  amount: {
    type: String,
    required: true,
  },
});
</script>
