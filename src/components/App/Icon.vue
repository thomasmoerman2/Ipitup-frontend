
<template>
<Eye v-if="props.name === 'eye'" :class="color" />
<EyeOff v-if="props.name === 'eyeOff'" :class="color" />
<Search v-if="props.name === 'search'" :class="color" />
</template>

<script setup>
import { Eye, EyeOff, Search } from 'lucide-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
})
</script>
