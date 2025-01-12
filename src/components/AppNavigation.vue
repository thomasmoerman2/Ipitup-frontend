<template>
    <div class="flex justify-around border fixed w-full bottom-0 left-0 py-5 bg-white">
        <button v-for="(icon, index) in navigationIcons" :key="index" :to="icon.route" class="relative cursor-pointer grid place-items-center" @click="setActiveIcon(index)">
            <component :is="icon.component" :class="{ 'text-blue-60': activeIcon === index }" />
        </button>
        <div class="absolute w-5 h-[3px] bg-blue-60 rounded-full bottom-3 transition-all duration-300" :style="{ left: indicatorPosition }"></div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SquareKanban, UserSearch, House, BicepsFlexed, Activity } from 'lucide-vue-next';

const navigationIcons = [
    { component: SquareKanban, route: '/dashboard' },
    { component: UserSearch, route: '/search' },
    { component: House, route: '/' },
    { component: BicepsFlexed, route: '/workout' },
    { component: Activity, route: '/activity' }
];

const activeIcon = ref(2);

const indicatorPosition = computed(() => {
    const sectionWidth = 100 / navigationIcons.length;
    const position = (sectionWidth * activeIcon.value) + (sectionWidth / 2) - 3
    return `${position}%`;
});

const setActiveIcon = (index) => {
    activeIcon.value = index;
};
</script>

<style scoped>
.router-link-active {
    color: theme('colors.blue.60');
}
</style>