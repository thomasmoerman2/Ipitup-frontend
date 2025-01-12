<template>
    <div class="flex flex-col gap-5 z-50">
        <button class="w-[39px] h-[39px] grid place-items-center text-white bg-blue-54 rounded-full" @click="func_toggle">
            <TransitionGroup name="notification-icon" tag="div" class="grid place-items-center">
                <Bell v-if="!blnOpen" :key="'bell'" />
                <X v-else :key="'close'" />
            </TransitionGroup>
        </button>
        <TransitionGroup name="notification-list" tag="div" class="flex flex-col gap-2">
            <div v-if="blnOpen" v-for="(notification, index) in arrMessage" :key="index" class="rounded-md border border-blue-90 bg-blue-12 text-black-100" :style="{ transitionDelay: `${index * 100}ms` }">
                <div class="flex flex-col gap-1 p-2">
                    <div class="flex items-center w-max gap-2">
                        <div class="w-2 h-2 rounded-full bg-blue-90">
                        </div>
                        <strong>{{ notification.title }}</strong>
                    </div>
                    <p class="text-sm">{{ notification.message }}</p>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { ref, TransitionGroup } from 'vue';
import { Bell, X } from 'lucide-vue-next'

const blnOpen = ref(false);
const arrMessage = ref([
    {
        title: "Eerste notificatie",
        message: "Dit is je eerste notificatie!"
    },
    {
        title: "Tweede notificatie",
        message: "Hier is nog een notificatie!"
    },
    {
        title: "Laatste notificatie",
        message: "En nog eentje voor de zekerheid!"
    }
]);

const func_toggle = () => {
    blnOpen.value = !blnOpen.value;
}
</script>

<style scoped>
.notification-icon-enter-active,
.notification-icon-leave-active {
    transition: all 0.3s ease;
}

.notification-icon-enter-from,
.notification-icon-leave-to {
    opacity: 0;
    transform: scale(0.6) translateY(-8px);
}

.notification-icon-enter-to,
.notification-icon-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.notification-list-enter-active,
.notification-list-leave-active {
    transition: all 0.5s ease;
}

.notification-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.notification-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.notification-list-enter-to,
.notification-list-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
