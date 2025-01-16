<template>
    <header class="flex justify-between items-center py-5">
        <h1 class="text-lg font-semibold">{{ pageTitle }}</h1>
        <Notification :messages="[]" />
    </header>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import Notification from '@/components/Header/Notification.vue';

const route = useRoute();


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
</script>
