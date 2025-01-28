<template>
    <header class="flex justify-between items-center py-5">
        <h1 class="text-lg flex items-center gap-1 font-semibold capitalize">{{ pageTitle }} <span v-if="meta.name"> - {{ meta.name }}</span></h1>
        <Notification :messages="notifications" />
    </header>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Notification from '@/components/Header/Notification.vue';
import Cookies from 'js-cookie';

const oldNotif = ref(0);
const route = useRoute();
const audio = new Audio('/sounds/notification.mp3');
const intNotif = ref(null);


const props = defineProps({
    meta: {
        type: Object,
        required: true,
    },
});

const notifications = ref([]);

const pageTitle = computed(() => {
    const segments = route.path.split('/').filter(Boolean);

    if (segments.length === 0) return 'Home';

    // Map of parent routes to their display names
    const routeNames = {
        'workout': 'Workout',
        'podium': 'Podium',
        'search': 'Search',
        'profile': 'Profile'
    };

    // Always return the parent route name
    return routeNames[segments[0]] || segments[0];
});

const fetch_notifications = async () => {
    try {
        const userId = Cookies.get('userId');
        const authToken = Cookies.get('authToken');

        if (!userId || !authToken) {
            notifications.value = [];
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${userId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            notifications.value = [];
            return;
        }


        const text = await response.text();
        if (!text) {
            notifications.value = [];
            return;
        }

        const data = JSON.parse(text);
        notifications.value = data;


        if (oldNotif.value < notifications.value.length) {
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio playback was prevented:", error);
                });
            }
        }
        oldNotif.value = notifications.value.length;

    } catch {
        notifications.value = [];
    }
}

onMounted(() => {
    intNotif.value = setInterval(fetch_notifications, 6000);
});
fetch_notifications();

</script>