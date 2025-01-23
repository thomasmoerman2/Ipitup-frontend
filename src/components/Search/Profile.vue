<template>
  <RouterLink :to="`/user/${id}`" class="flex items-center justify-between h-max">
    <div class="flex items-center">
      <div class="w-16 h-16 grid place-items-center">
        <Beanhead v-bind="{ mask: true, avatar }" />
      </div>
      <p class="font-bold">{{ fullname }}</p>
    </div>
    <p class="text-xs text-black-40">@{{ firstname }}</p>
  </RouterLink>
</template>

<script setup>
import { Beanhead } from 'beanheads-vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
});
</script>
