<template>
    <header class="flex justify-between items-center py-5">
        <h1 class="text-lg flex items-center gap-1 font-semibold capitalize">{{ pageTitle }} <span v-if="meta.name"> - {{ meta.name }}</span></h1>
        <Notification :messages="notifications" />
    </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Notification from '@/components/Header/Notification.vue';
import Cookies from 'js-cookie';

const route = useRoute();

const props = defineProps({
    meta: {
        type: String,
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${Cookies.get('userId')}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`
        }
    });

    const data = await response.json();
    console.log(data);
    notifications.value = data;
}

onMounted(() => {
    fetch_notifications();
    setInterval(fetch_notifications, 25000);
});

</script>