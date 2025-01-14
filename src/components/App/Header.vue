<template>
    <div class="pt-[4rem] flex items-center justify-between">
        <h1 class="text-2xl">Header</h1>
        <div class="w-[39px] h-[39px] grid place-items-center text-white bg-blue-54 rounded-full relative">
            <HeaderNotification />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderNotification from '../Header/Notification.vue';

const streak = ref(0)
const blnFlame = ref(false)
</script>