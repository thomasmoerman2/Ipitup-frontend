<template>
    <TransitionGroup tag="div" name="notification" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
        <div v-for="notification in notifications" :key="notification.id" class="flex items-center gap-3 p-4 rounded-lg shadow-lg transform transition-all duration-300" :class="[
            notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black-100',
            notification.type === 'success' ? 'border-l-4 bg-blue-18' : ''
        ]">
            <!-- Icon -->
            <div class="flex-shrink-0">
                <AppIcon :name="notification.type === 'error' ? 'AlertCircle' : 'CheckCircle'" :color="notification.type === 'error' ? 'text-white' : 'text-blue-54'" :size="20" />
            </div>

            <!-- Content -->
            <div class="flex-1">
                <p class="font-medium">{{ notification.title }}</p>
                <p class="text-sm opacity-90">{{ notification.message }}</p>
            </div>

            <!-- Close button -->
            <button @click="removeNotification(notification.id)" class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                <AppIcon name="X" :size="16" :color="notification.type === 'error' ? 'text-white' : 'text-black-60'" />
            </button>
        </div>
    </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue';
import AppIcon from './Icon.vue';

const notifications = ref([]);
let notificationId = 0;

const addNotification = (title, message, type = 'info') => {
    const id = notificationId++;
    notifications.value.push({ id, title, message, type });
    setTimeout(() => removeNotification(id), 5000);
};

const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
};

defineExpose({ addNotification });
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
    transition: all 0.4s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}
</style>