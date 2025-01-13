<template>
    <Filter stroke-width="2.5" size="32" />
    <h1 class="font-bold">Filter</h1>
    <p class="text-sm text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium ut iure quis. Eaque voluptatibus commodi, nobis laudantium doloribus quas corporis, officia architecto quisquam vero nisi deserunt, voluptatem quaerat? Iste, nemo.</p>
    <AppButton text="Opslaan" @click="func_closeDialog" version="1" icon="false" />
</template>

<script setup>
import AppButton from '@/components/App/Button.vue';
import { Filter } from 'lucide-vue-next';
const emit = defineEmits(['closeDialog'])

const func_closeDialog = () => {
    emit('closeDialog')
}
</script>