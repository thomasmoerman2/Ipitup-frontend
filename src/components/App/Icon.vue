<template>
    <Eye v-if="props.name === 'eye'" :class="color" :size="size" />
    <EyeOff v-if="props.name === 'eyeOff'" :class="color" :size="size" />
    <Search v-if="props.name === 'search'" :class="color" :size="size" />
    <Camera v-if="props.name === 'camera'" :class="color" :size="size" />
    <Pen v-if="props.name === 'pen'" :class="color" :size="size" />
    <ArrowUpRight v-if="props.name === 'arrowUpRight'" :class="color" :size="size" />
</template>

<script setup>
import { Eye, EyeOff, Search, Camera, Pen, ArrowUpRight } from 'lucide-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    size: {
        type: Number,
        default: 16
    }
})
</script>