<template>
    <div class="fixed z-50 bottom-[24px] w-full px-4 left-0">
        <div class="flex justify-around shadow-nav py-3 rounded-md bg-white">
            <RouterLink v-for="item in navigation" :key="item.path" :to="item.path" class="relative flex-col gap-1 cursor-pointer grid place-items-center" :class="isActive(item.path) ? 'text-blue-54' : 'text-blue-84'">
                <component :is="item.icon" class="w-4 h-4" />
                <span class="text-2xs lowercase">{{ item.label }}</span>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { Home, SquareKanban, UserRoundSearch, BicepsFlexed, UserCircle2 } from 'lucide-vue-next';
const route = useRoute();

const navigation = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/workout', icon: BicepsFlexed, label: 'Workout' },
    { path: '/podium', icon: SquareKanban, label: 'Podium' },
    { path: '/search', icon: UserRoundSearch, label: 'Search' },
    { path: '/profile', icon: UserCircle2, label: 'Profile' },
];

const isActive = (path) => {
    if (path === '/') {
        return route.path === '/';
    }
    return route.path.includes(path);
};
</script>
