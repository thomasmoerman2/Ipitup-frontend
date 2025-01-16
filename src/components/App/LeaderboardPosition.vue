<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-1.5">
      <p
        :class="[
          me === 'true' ? 'bg-blue-48 text-black-5' : 'bg-blue-6 text-blue-48',
          'text-xs w-[1.125rem] text-center rounded-full',
        ]"
      >
        {{ position }}
      </p>

      <p class="text-xs">{{ name }}</p>
    </div>
    <div class="flex items-center gap-1">
      <AppIcon name="Gem" color="text-blue-48" size="12" />
      <p class="text-xs text-blue-48">{{ amount }}</p>
    </div>
  </div>
</template>

<script setup>
import AppIcon from "@/components/App/Icon.vue";

const props = defineProps({
  me: {
    type: String,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
</script>
