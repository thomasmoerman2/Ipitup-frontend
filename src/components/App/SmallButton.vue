<template>
  <button
    :class="[
      {
        'bg-blue-6 text-blue-96 text-xs rounded-[10px] flex gap-[5px] items-center justify-center px-4 py-2':
          props.version === 'blue' || props.version === '1',
        'bg-orange-5 text-orange-75 text-xs rounded-[10px] flex gap-[5px] items-center justify-center px-4 py-2':
          props.version === 'orange' || props.version === '2',
      },
    ]"
  >
    <AppIcon :name="props.icon"/>
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

  version: {
    type: String,
    required: "true",
    validator: (value) => {
      return ["blue", "orange", "1", "2"].includes(value);
    },
  },
});
</script>
