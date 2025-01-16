<template>
    <Eye v-if="props.name === 'eye'" :class="color" :size="size" />
    <EyeOff v-if="props.name === 'eyeOff'" :class="color" :size="size" />
    <Search v-if="props.name === 'search'" :class="color" :size="size" />
    <Camera v-if="props.name === 'camera'" :class="color" :size="size" />
    <Pen v-if="props.name === 'pen'" :class="color" :size="size" />
    <ArrowUpRight v-if="props.name === 'arrowUpRight'" :class="color" :size="size" />
    <User v-if="props.name === 'User'" :class="color" :size="size" />
    <UserRoundMinus v-if="props.name === 'UserRoundMinus'" :class="color" :size="size" />
    <Award v-if="props.name === 'Award'" :class="color" :size="size" />
    <RefreshCw v-if="props.name === 'RefreshCw'" :class="color" :size="size" />
    <Gem v-if="props.name === 'Gem'" :class="color" :size="size" />
    <Globe v-if="props.name === 'Globe'" :class="color" :size="size" />
    <Star v-if="props.name === 'Star'" :class="color" :size="size" />
    <ChevronRight v-if="props.name === 'ChevronRight'" :class="color" :size="size" />
    <Timer v-if="props.name === 'Timer'" :class="color" :size="size" />
    <Filter v-if="props.name === 'Filter'" :class="color" :size="size" />
    <X v-if="props.name === 'X'" :class="color" :size="size" />
</template>

<script setup>
import { Eye, EyeOff, Search, Camera, Pen, ArrowUpRight, UserRoundMinus, Award, RefreshCw, Gem, Globe, User, Star, ChevronRight, Timer, Filter, X } from 'lucide-vue-next';

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