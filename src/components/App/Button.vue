<template>
    <button :class="[
        'rounded-md flex gap-3 items-center justify-center w-max py-3 px-5',
        {
            'bg-blue-60 text-white': props.version === 'primary' || props.version === '1',
            'bg-purple-60 text-white': props.version === 'secondary' || props.version === '2',
            'bg-black-40 text-white': props.version === 'tertiary' || props.version === '3',
            'bg-blue-18 text-blue-84': props.version === 'outline' || props.version === '4'
        }
    ]">
        <ArrowUpRight v-if="props.icon == 'true'" />
        {{ props.text }}
    </button>
</template>

<script setup>
import { ArrowUpRight } from 'lucide-vue-next';

const props = defineProps({
    text: {
        type: String,
        required: "true"
    },
    icon: {
        type: String,
        default: "true"
    },
    version: {
        type: String,
        required: "true",
        validator: (value) => {
            return ['primary', 'secondary', 'tertiary', 'outline', '1', '2', '3', '4'].includes(value)
        }
    }
});
</script>