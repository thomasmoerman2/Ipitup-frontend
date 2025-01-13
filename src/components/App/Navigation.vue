<template>
    <div class="fixed z-50 bottom-[24px] w-full px-[16px] left-0 bg-white">
        <div class="flex justify-around shadow-nav py-3 rounded-md">
            <button v-for="(icon, index) in navigationIcons" :key="index" :to="icon.route" class="relative flex-col gap-1 cursor-pointer grid place-items-center" @click="setActiveIcon(index)" :class="{ 'text-blue-60': activeIcon === index }">
                <component :is="icon.component" />
                <span class="text-xs lowercase">{{ icon.label }}</span>
            </button>
            <button key="profile" class="relative flex flex-col gap-1 cursor-pointer place-items-center" :class="{ 'text-blue-60': activeIcon === 3 }" @click="setActiveIcon(3)" v-if="blnIsLoggedIn">
                <CircleUser />
                <span class="text-xs lowercase">Profile</span>
            </button>
            <button key="connect" class="relative flex flex-col gap-1 cursor-pointer place-items-center" :class="{ 'text-blue-60': activeIcon === 4 }" @click="setActiveIcon(4)" v-else>
                <Key />
                <span class="text-xs lowercase">Connect</span>
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { SquareKanban, UserSearch, House, BicepsFlexed, CircleUser, Key } from 'lucide-vue-next';

const navigationIcons = [
    { component: House, route: '/', label: 'Home' },
    { component: BicepsFlexed, route: '/workout', label: 'Workout' },
    { component: SquareKanban, route: '/dashboard', label: 'podium' },
    { component: UserSearch, route: '/search', label: 'Search' },
];

const activeIcon = ref(0);
const blnIsLoggedIn = ref(false);

const setActiveIcon = (index) => {
    activeIcon.value = index;
};
</script>

<style scoped>
.router-link-active {
    color: theme('colors.blue.60');
}
</style>
