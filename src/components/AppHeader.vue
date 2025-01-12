<template>
    <div class="flex items-center justify-between">
        <div class="w-[39px] h-[39px] grid place-items-center text-white bg-blue-54 rounded-full relative">
            <HeaderNotification />
        </div>
        <div class="flex items-center gap-1">
            <strong class="uppercase">non-stop</strong>
            <Flame v-if="!blnFlame" fill="#bfbfbf" stroke="#8c8c8c" />
            <Flame fill="#b3e5e7" stroke="#1cb2b7" v-else />
            <strong>{{ streak }}</strong>
            <div class="w-[39px] ml-2 h-[39px] grid place-items-center text-white bg-blue-54 rounded-full">
                <User />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Flame, User } from 'lucide-vue-next'
import HeaderNotification from './HeaderNotification.vue';

const streak = ref(0)
const blnFlame = ref(false)
</script>