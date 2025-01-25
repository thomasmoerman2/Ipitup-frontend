<template>
    <div class="relative">
        <button class="w-[39px] h-[39px] grid place-items-center text-white bg-blue-54 rounded-full relative" @click="func_toggle">
            <div class="relative w-full h-full grid place-items-center">
                <Bell class="absolute transition-all duration-300 ease-in-out" :class="blnOpen ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'" />
                <X class="absolute transition-all duration-300 ease-in-out" :class="blnOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'" />
            </div>
            <!-- Notification Badge -->
            <div v-show="messages.length > 0" class="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-blue-12 text-white text-xs rounded-full grid place-items-center px-1">
                {{ messages.length }}
            </div>
        </button>

        <TransitionGroup name="notification-list" tag="div" class="absolute -right-2 top-[45px] w-[280px] flex flex-col gap-2 z-[60]">
            <div v-if="blnOpen" v-for="(notification, index) in messages" :key="index" class="rounded-md border border-blue-90 bg-blue-12 text-black-100 shadow-nav" :style="{ transitionDelay: `${index * 100}ms` }">
                <div class="flex flex-col gap-1 p-3">
                    <div class="flex items-center w-max gap-2">
                        <div class="w-2 h-2 rounded-full bg-blue-90"></div>
                        <strong class="capitalize">{{ (() => {
                            switch (notification.type) {
                                case 0:
                                    return "alert";
                                    break;
                                case 1:
                                    return "reminder";
                                    break;
                                case 2:
                                    return "achievement";
                                    break;
                                case 3:
                                    return "friendRequest";
                                    break;
                            }
                        })() }}</strong>
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
import Cookies from 'js-cookie';

const blnOpen = ref(false);

const props = defineProps({
    messages: {
        type: Array
    }
});


const func_toggle = () => {
    blnOpen.value = !blnOpen.value;

    if (!blnOpen.value) {
        fetch_notifications_asreaded();
    }
}

const fetch_notifications_asreaded = async () => {
    const userId = Cookies.get('userId');
    const notifications = props.messages.map(notification => notification.notificationId);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${userId}/read`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('authToken')}`
        },
        body: JSON.stringify(notifications)
    });

    const data = await response.json();
}

const fetch_notifications = async () => {
    const response = await fetch('https://data.tm-dev.be/ipitup/config.json');
    const data = await response.json();
    console.log("data.notifications ->", data.notifications);

    if (data.notifications.length > 0) {
        for (let i = 0; i < data.notifications.length; i++) {
            if (data.notifications[i].date_published > new Date() && data.notifications[i].date_deleted < new Date()) {
                messages.value.push(data.notifications[i]);
            }
        }
    }
}

fetch_notifications();
// setInterval(fetch_notifications, 1000);

</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-list-enter-from {
    opacity: 0;
    transform: translateY(15px);
}

.notification-list-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}
</style>
