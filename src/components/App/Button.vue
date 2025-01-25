<template>
  <button @click="handleClick" :class="[
    {
      'bg-blue-54 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3 disabled:opacity-50':
        props.version === 'primary' || props.version === '1',
      'bg-orange-50 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3 disabled:opacity-50':
        props.version === 'secondary' || props.version === '2',
      'bg-black-40 text-white rounded-[10px] flex gap-3 items-center justify-center w-full py-3 disabled:opacity-50':
        props.version === 'tertiary' || props.version === '3',
      'bg-blue-18 text-blue-84 rounded-[10px] flex gap-3 items-center justify-center w-full py-3 disabled:opacity-50':
        props.version === 'outline' || props.version === '4',
      'text-blue-84 underline py-0 w-max disabled:opacity-50':
        props.version === 'link' || props.version === '5',
    },
  ]">
    <ArrowUpRight v-if="props.icon == 'true'" />
    {{ props.text }}
  </button>
</template>

<script setup>
import { ArrowUpRight } from "lucide-vue-next";
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClick = () => {
  console.log("handleClick");
  if (props.version === "link") {
    console.log("props.version ->", props.version);
    if (props.link) {
      console.log("props.link ->", props.link);
      if (!props.link.startsWith("/")) {
        console.log("open in new tab");
        window.open(props.link, '_blank');
      } else {
        console.log("open in router");
        router.push(props.link);
      }
    }
  }
}

const props = defineProps({
  text: {
    type: String,
    required: "true",
  },
  icon: {
    type: String,
    default: "true",
  },
  link: {
    type: String,
    default: "",
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
