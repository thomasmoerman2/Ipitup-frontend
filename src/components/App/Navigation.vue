<template>
    <div class="fixed z-50 bottom-[24px] w-full px-4 left-0">
        <div class="flex justify-around shadow-nav py-3 rounded-md bg-white">
            <RouterLink v-for="item in navigation" :key="item.path" :to="item.path" class="relative flex-col gap-1 cursor-pointer grid place-items-center" :class="isActive(item.path) ? 'text-blue-54' : 'text-blue-84'">
                <component :is="item.icon" class="w-4 h-4" />
                <span class="text-2xs lowercase">{{ item.label }}</span>
            </RouterLink>
            <RouterLink v-if="userAuthenticated" to="/profile" class="relative flex-col gap-1 cursor-pointer grid place-items-center" :class="isActive('/profile') ? 'text-blue-54' : 'text-blue-84'">
                <Icon name="UserCircle2" class="w-4 h-4" />
                <span class="text-2xs lowercase">profile</span>
            </RouterLink>
            <RouterLink v-if="!userAuthenticated" to="/register" class="relative flex-col gap-1 cursor-pointer grid place-items-center" :class="isActive('/register') ? 'text-blue-54' : 'text-blue-84'">
                <Icon name="KeyRound" class="w-4 h-4" />
                <span class="text-2xs lowercase">connect</span>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Home, SquareKanban, UserRoundSearch, BicepsFlexed } from 'lucide-vue-next';
import Icon from './Icon.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();
const userAuthenticated = ref(false);



// Check auth status
const checkAuth = () => {
    const hasAuth = Cookies.get('authToken');
    if (hasAuth !== userAuthenticated.value) {
        userAuthenticated.value = hasAuth;
    }
}

// Set up interval to check auth status
let authCheckInterval;

onMounted(() => {
    // Initial check
    checkAuth();

    // Check every second for changes
    authCheckInterval = setInterval(checkAuth, 1000);
});

onUnmounted(() => {
    if (authCheckInterval) {
        clearInterval(authCheckInterval);
    }
});

const navigation = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: UserRoundSearch, label: 'Search' },
    { path: '/workout', icon: BicepsFlexed, label: 'Workout' },
    { path: '/podium', icon: SquareKanban, label: 'Podium' },
];

const isActive = (path) => {
    if (path === '/') {
        return route.path === '/';
    }
    return route.path.includes(path);
};
</script>
