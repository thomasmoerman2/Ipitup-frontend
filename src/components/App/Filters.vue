<template>
  <button :class="[
    {
      'bg-blue-6 text-blue-48': props.version === 'light',
      'bg-blue-48 text-blue-6': props.version === 'dark',
    },
    'flex items-center justify-center text-sm gap-2 rounded-[0.625rem] px-5 py-2',
    props.filterClass ? props.filterClass : 'w-max'
  ]">
    <AppIcon :name="props.icon" />
    {{ props.text }}
  </button>
</template>

<script setup>
import AppIcon from "@/components/App/Icon.vue";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: "true",
  },
  filterClass: {
    type: String,
    default: "",
  },
  version: {
    type: String,
    required: true,
    default: "light",
    validator: (value) => {
      return ["dark", "light"].includes(value);
    },
  },
});
</script>
