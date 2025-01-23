<template>
    <Eye v-if="props.name === 'eye'" :class="color" :size="size" :fill="fill"/>
    <EyeOff v-if="props.name === 'eyeOff'" :class="color" :size="size" :fill="fill"/>
    <Search v-if="props.name === 'search'" :class="color" :size="size" :fill="fill"/>
    <Camera v-if="props.name === 'camera'" :class="color" :size="size" :fill="fill"/>
    <Pen v-if="props.name === 'pen'" :class="color" :size="size" :fill="fill"/>
    <ArrowUpRight v-if="props.name === 'arrowUpRight'" :class="color" :size="size" />
    <User v-if="props.name === 'User'" :class="color" :size="size" />
    <UserRoundMinus v-if="props.name === 'UserRoundMinus'" :class="color" :size="size" />
    <Award v-if="props.name === 'Award'" :class="color" :size="size" :fill="fill"/>
    <RefreshCw v-if="props.name === 'RefreshCw'" :class="color" :size="size" />
    <Gem v-if="props.name === 'Gem'" :class="color" :size="size" :fill="fill"/>
    <Globe v-if="props.name === 'Globe'" :class="color" :size="size" :fill="fill"/>
    <Star v-if="props.name === 'Star'" :class="color" :size="size" :fill="fill"/>
    <ChevronRight v-if="props.name === 'ChevronRight'" :class="color" :size="size" />
    <ChevronsUpDown v-if="props.name === 'ChevronsUpDown'" :class="color" :size="size" />
    <Timer v-if="props.name === 'Timer'" :class="color" :size="size" />
    <X v-if="props.name === 'X'" :class="color" :size="size" />
    <Filter v-if="props.name === 'Filter'" :class="color" :size="size" />
    <ArrowLeft v-if="props.name === 'ArrowLeft'" :class="color" :size="size" />
    <Flame v-if="props.name === 'Flame'" :class="color" :size="size" :fill="fill"/>
    <Dumbbell v-if="props.name === 'Dumbbell'" :class="color" :size="size" :fill="fill"/>
    <KeyRound v-if="props.name === 'KeyRound'" :class="color" :size="size" :fill="fill"/>
    <UserCircle2 v-if="props.name === 'UserCircle2'" :class="color" :size="size" :fill="fill"/>
    <Check v-if="props.name === 'Check'" :class="color" :size="size" />
    <Lock v-if="props.name === 'Lock'" :class="color" :size="size" :fill="fill"/>
    <Atom v-if="props.name === 'Atom'" :class="color" :size="size" :fill="fill"/>
</template>

<script setup>
import { Eye, EyeOff, Search, Camera, Pen, ArrowUpRight, ArrowLeft, UserRoundMinus, Award, RefreshCw, Gem, Globe, User, Star, ChevronRight, ChevronsUpDown, Timer, X, Filter, Flame, Dumbbell, UserCircle2, KeyRound, Check, Lock, Atom } from 'lucide-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    fill: {
        type: String,
        default: 'none'
    },
    size: {
        type: Number,
        default: 16
    }
})
</script>