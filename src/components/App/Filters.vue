<template>
    <button class="flex items-center text-sm gap-2 bg-blue-6 text-blue-54 rounded-md px-2.5 py-2 w-max" v-if="type == 'filter'">
        <Filter size="16" />
        <span>Filter</span>
    </button>

    <button class="flex items-center text-sm gap-2 bg-blue-42 text-blue-6 rounded-md px-2.5 py-2 w-max" v-else-if="type == 'optie'">
        <X size="16" />
        <span>{{ optie }}</span>
    </button>
</template>

<script setup>
import { Filter, X } from 'lucide-vue-next';

const props = defineProps({
    optie: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'filter'
    }
})
</script>