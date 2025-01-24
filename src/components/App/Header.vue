<template>
    <header class="flex justify-between items-center py-5">
        <h1 class="text-lg flex items-center gap-1 font-semibold capitalize">{{ pageTitle }} <span v-if="meta.name"> - {{ meta.name }}</span></h1>
        <Notification :messages="[]" />
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Notification from '@/components/Header/Notification.vue';

const route = useRoute();

const props = defineProps({
    meta: {
        type: Object,
        required: true,
    },
});

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
