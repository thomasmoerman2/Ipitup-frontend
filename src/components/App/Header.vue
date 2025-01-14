<template>
    <div class="flex items-center justify-between">
        <h1 class="font-bold text-lg">{{ title }}</h1>
        <div class="w-[39px] h-[39px] grid place-items-center text-white bg-blue-54 rounded-full relative">
            <HeaderNotification />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderNotification from '../Header/Notification.vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Header'
    },
    title: {
        type: String,
        default: 'Workout'
    }
})
</script>
