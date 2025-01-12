<template>
    <button :class="[
        'rounded-md flex gap-3 items-center justify-center w-max py-3 px-5',
        {
            'bg-blue-60 text-white': version === 'primary' || version === '1',
            'bg-purple-60 text-white': version === 'secondary' || version === '2',
            'bg-black-40 text-white': version === 'tertiary' || version === '3',
            'bg-blue-18 text-blue-84': version === 'outline' || version === '4'
        }
    ]">
        <ArrowUpRight v-if="icon" />
        {{ text }}
    </button>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    icon: {
        type: Boolean,
        default: true
    },
    version: {
        type: String,
        required: true,
        validator: (value) => {
            return ['primary', 'secondary', 'tertiary', 'outline', '1', '2', '3', '4'].includes(value)
        }
    }
});
</script>