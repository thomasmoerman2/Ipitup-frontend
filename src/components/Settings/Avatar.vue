<template>
  <div class="rounded-full w-[10rem] h-[10rem] flex items-center justify-center relative">
    <Beanhead v-bind="{ mask: true, avatar }" class="w-full h-full" />
    <div v-if="edit === 'true'" class="rounded-full bg-blue-18 w-6 h-6 flex items-center justify-center absolute bottom-0 right-0">
      <AppIcon name="pen" color="text-blue-108" :size="14" />
    </div>
  </div>
</template>

<script setup>
import AppIcon from '@/components/App/Icon.vue';
import { Beanhead } from 'beanheads-vue';

const props = defineProps({
  edit: {
    type: String,
    default: "false",
  },
  avatar: {
    type: String,
    default: "",
  },
});
</script>
