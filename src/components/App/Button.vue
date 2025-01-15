<template>
  <button :class="[
    {
      'bg-blue-54 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3':
        props.version === 'primary' || props.version === '1',
      'bg-orange-50 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3':
        props.version === 'secondary' || props.version === '2',
      'bg-black-40 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3':
        props.version === 'tertiary' || props.version === '3',
      'bg-blue-18 text-blue-84 rounded-[10px] flex gap-3 items-center justify-center w-full py-3':
        props.version === 'outline' || props.version === '4',
      'text-blue-84 underline py-0 w-max':
        props.version === 'link' || props.version === '5',
    },
  ]">
    <ArrowUpRight v-if="props.icon == 'true'" />
    {{ props.text }}
  </button>
</template>

<script setup>
import { ArrowUpRight } from "lucide-vue-next";

const props = defineProps({
  text: {
    type: String,
    required: "true",
  },
  icon: {
    type: String,
    default: "true",
  },
  version: {
    type: String,
    required: "true",
    validator: (value) => {
      return [
        "primary",
        "secondary",
        "tertiary",
        "outline",
        "link",
        "1",
        "2",
        "3",
        "4",
        "5",
      ].includes(value);
    },
  },
});
</script>
